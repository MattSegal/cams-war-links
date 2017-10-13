# Restore backups with
#     echo "DROP SCHEMA public CASCADE;CREATE SCHEMA public;" | 
#         sudo -u postgres -i psql $APP_NAME
#     cat $BACKUP.gz |
#         gunzip |
#         sudo -u postgres -i psql $APP_NAME

APP_NAME="$1"
SERVER="$2"

TIME=$(date "+%s")
BACKUP_DIR="/var/backups/${APP_NAME}"
BACKUP_FILE="postgres_${TIME}.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"
        
ssh "root@${SERVER}" << EOF
    mkdir -p ${BACKUP_DIR}
    sudo -u postgres -i pg_dump "$APP_NAME" | gzip > "$BACKUP_PATH"
EOF

scp "root@${SERVER}:${BACKUP_PATH}" .
