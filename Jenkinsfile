#!/usr/bin/env groovy
env.ENVIRONMENT_TYPE = env.ENVIRONMENT_TYPE ?: 'TEST' // TEST or PROD
env.TARGET_NODE_ADDRESS = env.TARGET_NODE_ADDRESS ?: '192.168.2.3'
env.APP_NAME = env.APP_NAME ?: 'links'

def unwanted_files = [
    'Jenkinsfile',
    'package.json',
    'README.md',
    'webpack.config.js',
]

def unwanted_folders = [
    'assets-src',
]

def WEBAPPS_DIR = '/var/webapps'
def DEPLOY_DIR = "${WEBAPPS_DIR}/${APP_NAME}/app"
def VIRTUALENV_DIR = "${WEBAPPS_DIR}/${APP_NAME}"
def ZIP_FILE = "${APP_NAME}.tar.gz"

def process_webpack_stats = """
import json
file_path = \"./webpack-stats.json\"
with open(file_path,\"r\") as f:
    stats = json.load(f)

if stats[\"status\"] != \"done\":
    raise Exception(stats)

for idx in range(len(stats[\"chunks\"][\"main\"])):
    file_name = stats[\"chunks\"][\"main\"][idx][\"path\"].split(\"/\")[-1]
    stats[\"chunks\"][\"main\"][idx][\"path\"] = \"${DEPLOY_DIR}/assets/\" + file_name

with open(file_path,\"w\") as f:
    json.dump(stats,f)
"""

def clone_or_pull(directory, remote)
{
    sh ("""
    if [ ! -d ${directory}/.git ]
    then
        git clone ${remote} ${directory}
    else
        git -C ${directory} pull
    fi
    """)
}

def ssh(bash_commands, env_vars=[:])
{
    env_str= ""
    for (el in env_vars)
    {
        env_str+= "export ${el.key}=\"${el.value}\";"
    }
    sh "sudo ssh root@${TARGET_NODE_ADDRESS} '${env_str}${bash_commands}'"
}


def sftp(local_file,remote_dir)
{
    sh "echo 'put ${local_file}' | sudo sftp root@${TARGET_NODE_ADDRESS}:${remote_dir}"
}

node
{
echo "Begin deployment of ${APP_NAME} to ${TARGET_NODE_ADDRESS} with environment type ${ENVIRONMENT_TYPE}"

stage 'Checkout'
echo '===== Git Checkout ====='
checkout([
    $class: 'GitSCM', 
    branches: [[name: '*/django_links']], 
    doGenerateSubmoduleConfigurations: false, 
    extensions: [], 
    submoduleCfg: [], 
    userRemoteConfigs: [[url: 'https://github.com/MattSegal/Link-Sharing-Site.git']]
])

stage 'Build'
echo '===== Building ====='

// Get cached node_modules
sh ("""
if [ -d /var/build/node_modules ]
then 
    cp -r /var/build/node_modules ./node_modules
    npm rebuild node-sass
else 
    mkdir -p /var/build/node_modules
fi
""")
sh 'npm install'

// Build javascript 
sh 'export DEPLOY_STATUS="TEST";webpack --config ./webpack.config.js'

// Fix webpack-stats.json
sh "echo '${process_webpack_stats}' | python"

// Cache node_modules
sh 'rm -rf /var/build/node_modules'
sh 'mv ./node_modules /var/build/node_modules'

// Delete stuff we don't want/need
for (folder in unwanted_folders)
{
    sh "rm -rf ./${folder}"
}

for (file in unwanted_files)
{
    sh "rm ./${file}"
}

stage 'Deploy' 
echo '===== Deployment ====='

// Compress the payload
sh "if [ -f ${ZIP_FILE} ];then rm ${ZIP_FILE};fi"
sh "tar -zcf ${ZIP_FILE} ./*"

// Apply configuration with SaltStack
echo 'Pulling latest SaltStack config'
sh 'mkdir -p /srv'
clone_or_pull('/srv/salt', 'https://github.com/MattSegal/WebserverSalt.git')

echo 'Testing SaltStack connections'
sh 'sudo salt "*" test.ping'

echo 'Applying latest SaltStack config'
sh 'sudo salt "*" state.highstate  -l debug'

sshagent(['jenkins']) 
{
// Print box name as debug step
ssh('uname -a')

// Kill gunicorn
ssh("${VIRTUALENV_DIR}/bin/gunicorn_stop", [NAME: APP_NAME])

// STFP and extract zip file
ssh("rm -rf ${DEPLOY_DIR}/*")
sftp("./${ZIP_FILE}", "/tmp/")
ssh("tar -zxf /tmp/${ZIP_FILE} --directory ${DEPLOY_DIR}/")
ssh("rm /tmp/${ZIP_FILE}")
ssh("chown www-data: ${DEPLOY_DIR}")

// Start gunicorn + Django
ssh("${VIRTUALENV_DIR}/bin/gunicorn_start deploy", [
    ALLOWED_HOSTS: TARGET_NODE_ADDRESS,
    APP_NAME: APP_NAME,
    DJANGODIR: DEPLOY_DIR,
    LOGFILE: "${VIRTUALENV_DIR}/gunicorn.log",
    DJANGO_STATIC_ROOT: '/var/static',
    DEPLOY_STATUS: ENVIRONMENT_TYPE
])

// use this to start gunicorn when ssh'd in
// use . ../bin/set_env_vars
// eg
// . ../bin/set_env_vars;
ssh("""
touch ${VIRTUALENV_DIR}/bin/set_env_vars

cat > ${VIRTUALENV_DIR}/bin/set_env_vars << EOM
export DEPLOY_STATUS='${ENVIRONMENT_TYPE}'
export DJANGO_STATIC_ROOT='/var/static'
export ALLOWED_HOSTS='${TARGET_NODE_ADDRESS}'
EOM

chmod +x ${VIRTUALENV_DIR}/bin/set_env_vars
""")

if (env.ENVIRONMENT_TYPE == 'TEST')
{
ssh("""
touch ${VIRTUALENV_DIR}/bin/build_test_data

cat > ${VIRTUALENV_DIR}/bin/build_test_data << EOM
source ${VIRTUALENV_DIR}/bin/activate;
source ${VIRTUALENV_DIR}/bin/set_env_vars;
python ${VIRTUALENV_DIR}/app/manage.py shell -c 'from api.factories import build;build()'
EOM

chmod +x ${VIRTUALENV_DIR}/bin/build_test_data
""")
} // if

} // sshagent

echo 'Cleaning up workspace'
sh 'rm -rf ./*'

} // node