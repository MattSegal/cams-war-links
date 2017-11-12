APP_NAME="$1"
SERVER="$2"
BACKUP_FILE="$3"
        
ssh "root@${SERVER}" << EOF
    mkdir -p /tmp/pg_restore/
EOF

scp "$BACKUP_FILE" "root@${SERVER}:/tmp/pg_restore/${BACKUP_FILE}"

ssh "root@${SERVER}" << EOF
    mkdir -p /tmp/pg_restore/
    sudo -u postgres -i pg_dump "$APP_NAME" | gzip > "$BACKUP_PATH"

    echo "DROP SCHEMA public CASCADE;CREATE SCHEMA public;" | 
        sudo -u postgres -i psql "$APP_NAME"
    cat "/tmp/pg_restore/${BACKUP_FILE}" |
        gunzip |
        sudo -u postgres -i psql "$APP_NAME"
EOF
