VIRTUALENV_DIR="$1"
APP_NAME="$2"
SERVER="$3"

# Prepare
ssh "root@${SERVER}" << EOF
    if [ -d "$VIRTUALENV_DIR" ]
    then 
        eval "${VIRTUALENV_DIR}/bin/gunicorn_stop"
    fi
EOF
