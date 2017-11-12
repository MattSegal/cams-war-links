# Copies files to server and extracts to $TARGET_DIR
FILE="$1"
TARGET_DIR="$2"
SERVER="$3"

ssh "root@${SERVER}" "mkdir -p $TARGET_DIR; rm -rf $TARGET_DIR/*";
scp "$FILE" "root@${SERVER}:${TARGET_DIR}"
ssh "root@${SERVER}" "tar -zxf \"${TARGET_DIR}/${FILE}\" --directory $TARGET_DIR"
