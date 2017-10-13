VIRTUALENV_DIR="$1"
APP_NAME="$2"
DEPLOY_DIR="$3"
ENVIRONMENT_TYPE="$4"
SERVER="$5"


ENV_VAR_SCRIPT="${VIRTUALENV_DIR}/bin/set_env_vars"
# Possibly terrible
ENV_VAR_SCRIPT_TEXT=$(cat  << EOM
    export ALLOWED_HOSTS="${SERVER},www.${SERVER}"
    export APP_NAME="$APP_NAME"
    export DJANGODIR="$DEPLOY_DIR"
    export LOGFILE="${VIRTUALENV_DIR}/gunicorn.log"
    export DJANGO_STATIC_ROOT="/var/static"
    export DEPLOY_STATUS="$ENVIRONMENT_TYPE"
EOM)

# Prepare
ssh "root@${SERVER}" << EOF

    # Add helper script to set required envars
    echo "$ENV_VAR_SCRIPT_TEXT" > "$ENV_VAR_SCRIPT"
    chmod +x "$ENV_VAR_SCRIPT" 

    # Load env vars and start up gunicorn
    . "$ENV_VAR_SCRIPT" 
    eval "${VIRTUALENV_DIR}/bin/gunicorn_start deploy"
EOF
