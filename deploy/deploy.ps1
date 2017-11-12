<#
Deployment for Links
    - Build
        + Checkout code
        + Build JavaScript
        + Prune build artifacts
        + Create zip file 
    - Deploy
        + Copy zip to server
        + Stop app server
        + TODO: Run configration managment
        + Create database backups
        + Configure app server
        + Start app server

#>
param(
    [Parameter(Mandatory=$true)]
    [String]$Server,
    [String]$Branch='master'
)

# ========== BUILD PARAMETERS ==========
# Local parameters
$GIT_REPOSITORY = 'https://github.com/MattSegal/Link-Sharing-Site.git'
$SERVER = $Server
$APP_NAME = 'links'
$BUILD_FOLDER = 'build'
$ENVIRONMENT_TYPE = 'PROD'  # TEST or PROD
$UNWANTED_FILES = @(
    '.babelrc',
    '.gitignore',
    'Jenkinsfile',
    'package.json',
    'README.md',
    'requirements-dev.txt',
    'scripts.ps1',
    'webpack.config.js'
)
$UNWANTED_FOLDERS = @(
    'assets-src',
    'node_modules',
    'deploy',
    'chrome-ext'
)

# Server-side parameters
$WEBAPPS_DIR = '/var/webapps'
$DEPLOY_DIR = "${WEBAPPS_DIR}/${APP_NAME}/app"
$VIRTUALENV_DIR = "${WEBAPPS_DIR}/${APP_NAME}"
$ZIP_FILE = "${APP_NAME}.tar.gz"

# ========== SETUP ==========
$ErrorActionPreference = "Stop"

# ========== BUILD STAGE ==========
# Checkout code
if (Test-Path $BUILD_FOLDER) 
{
    Write-Host "`nCleaning up old build folder"
    Remove-Item $BUILD_FOLDER -Recurse -Force
}
Write-Host "`nCloning git repository"
git clone $GIT_REPOSITORY $BUILD_FOLDER
pushd $BUILD_FOLDER
    git checkout $Branch

    # Build JavaScript assets
    Write-Host "`nInstalling NPM packages"
    npm install
    Write-Host "`nRunning Webpack build"
    $env:ENVIRONMENT_TYPE = $ENVIRONMENT_TYPE
    webpack --config ./webpack.config.js
popd

Write-Host "`nPreparing build assets"
python ./scripts/fix_webpack_stats.py "./${BUILD_FOLDER}/webpack-stats.json" $DEPLOY_DIR

# Delete stuff that we don't want to deploy
ForEach ($folder in $UNWANTED_FOLDERS)
{
    $buildFolder = Join-Path $BUILD_FOLDER $folder
    if (Test-Path $buildFolder) 
    {
        Remove-Item $buildFolder -Recurse -Force
    }
}
ForEach ($file in $UNWANTED_FILES)
{
    $buildFile = Join-Path $BUILD_FOLDER $file
    if (Test-Path $buildFile)
    {
        Remove-Item $buildFile -Recurse -Force
    }
}
Write-Host "`nCompressing build assets"
if (Test-Path $ZIP_FILE) 
{
    Write-Host "`nCleaning up old build zip"
    Remove-Item $ZIP_FILE -Force
}
bash -c "tar -zcf $ZIP_FILE ./${BUILD_FOLDER}/*"

Write-Host "`nCleaning up build artifacts"
if (Test-Path $BUILD_FOLDER) {
    Remove-Item -Force -Recurse $BUILD_FOLDER
}


# ========== DEPLOY STAGE ==========
# TODO: SaltStack or Ansible

# Copy assets to server and extract
Write-Host "`nCopying build to server"
$tmpDir = "/tmp/${APP_NAME}"
bash ./scripts/copy_build.sh $ZIP_FILE $tmpDir $SERVER
Remove-Item $ZIP_FILE

# Turn off server
Write-Host "`nStopping app server"
bash ./scripts/stop_app.sh $VIRTUALENV_DIR $APP_NAME $SERVER

# Create and extract DB backups, the store in S3
if ($SERVER -eq 'mattslinks.xyz') {
    Write-Host "`nFetching database backups"
    bash ./scripts/get_db_backups.sh $APP_NAME $SERVER
    $backup =  Get-ChildItem | Where {$_.Name -like "postgres_*"}
    ./env/Scripts/activate
    python ./scripts/backup_file.py upload --filename $backup
    deactivate
    Remove-Item $backup
}

# Do setup on server
Write-Host "`nConfiguring app server"
bash ./scripts/setup_app.sh $DEPLOY_DIR $tmpDir $BUILD_FOLDER $SERVER

# Start server
Write-Host "`nStarting app server"
bash ./scripts/start_app.sh $VIRTUALENV_DIR $APP_NAME $DEPLOY_DIR $ENVIRONMENT_TYPE $SERVER

