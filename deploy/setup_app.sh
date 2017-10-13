DEPLOY_DIR="$1"
TEMP_DIR="$2"
BUILD_FOLDER="$3"
SERVER="$4"

BACKUP_DIR="${TEMP_DIR}/old"
BUILD_DIR="${TEMP_DIR}/${BUILD_FOLDER}"

ssh "root@${SERVER}" << EOF
    # Backup the old app code
    if [ -d "$BACKUP_DIR" ]
    then
        rm -rf "$BACKUP_DIR"
    fi
    mv  "$DEPLOY_DIR" "$BACKUP_DIR"

    # Copy the new code
    mv "$BUILD_DIR" "$DEPLOY_DIR" -v
    chown www-data: "$DEPLOY_DIR" -R
EOF
