param([String]$Option)

function ActivateEnv
{
    $env:ALLOWED_HOSTS = "localhost,192.168.1.9"
    .\env\Scripts\activate
}

function RunDjango 
{
    ActivateEnv
    py .\manage.py runserver 0.0.0.0:80
}

function RunWebpack 
{
    Get-Item .\assets\*.css | % {Remove-Item $_.FullName}
    Get-Item .\assets\*.js  | % {Remove-Item $_.FullName}
    npm run dev
}


function RunRedis 
{
    redis-server
}

function RunDevEnvironment
{
    $dir = pwd
    powershell -NoExit -new_console:f:n:s75V:t:"Webpack" "cd $dir;. ./scripts.ps1;RunWebpack"
    powershell -NoExit -new_console:f:n:s66V:t:"Django" "cd $dir;. ./scripts.ps1;RunDjango" 
    # powershell -NoExit -new_console:f:n:s33V:t:"Redis" "cd $dir;. ./scripts.ps1;RunRedis"  
    ActivateEnv
}

function RunCodeLinting
{
    ActivateEnv
    Write-Host "`nRunning isort`n"
    pushd links;isort -y;popd
    pushd api;isort -y;popd
    Write-Host "`nRunning Flake8`n"
    flake8 links
    flake8 api
}

switch ($Option)
{
    'dev' {
        RunDevEnvironment
    }
    'lint' {
        RunCodeLinting
    }
    Default {
        Write-Host "`n===== Links Scripts ====="
        Write-Host "dev   Run dev environment"
        Write-Host "lint  Run linter"
    }
}