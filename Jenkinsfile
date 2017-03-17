pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo '===== Building ====='
                
                // // Get cached node_modules
                // sh 'mkdir -p /var/build/node_modules'
                // sh 'mv /var/build/node_modules ./node_modules'
                // sh 'npm install'

                // // Build javascript 
                // sh 'webpack --config ./webpack.config.js'
                
                // // Cache node_modules
                // sh 'mv ./node_modules /var/build/node_modules'

                // // Delete stuff we don't want/need
                // sh 'rm -rf ./assets-src'
                // sh 'rm ./.gitignore'
                // sh 'rm ./debian.txt'
                // sh 'rm ./config.py'
                // sh 'rm ./deploy.json'
                // sh 'rm ./Jenkinsfile'
                // sh 'rm ./package.json'
                // sh 'rm ./README.md'
                // sh 'rm ./webpack.config.js'
            }
        }
        stage('Test') {
            steps {
                echo '===== Test ====='
            }
        }
        stage('Deploy') {
            // https://hynek.me/articles/python-deployment-anti-patterns/
            // https://news.ycombinator.com/item?id=3879926
            // Manage remote daemons with supervisord
            steps {
                echo '===== Deployment ====='

                script {
                    app_name = 'links'
                    webapps_dir = '/var/webapps'

                    env.TARGET_IP = '192.168.2.3'
                    env.DEPLOY_DIR = "${webapps_dir}/${app_name}/app"
                    env.VIRTUALENV_DIR = "${webapps_dir}/${app_name}"
                    env.ZIP_FILE = "${app_name}.tar.gz"
                    env.PYTHONPATH = "${VIRTUALENV_DIR}/lib/python2.7/site-packages/,${DEPLOY_DIR}"
                    env.ALLOWED_HOSTS = "${TARGET_IP}"
                }

                // Compress the payload
                sh 'if [ -f ${ZIP_FILE} ];then rm ${ZIP_FILE};fi'
                sh 'tar -zcvf ${ZIP_FILE} ./*'

                // Apply configuration with SaltStack
                // TODO: pull / clone configuration from config repo
                sh 'salt "web" state.highstate -l debug'

                sshagent(['jenkins']) {
                    // Print box name as debug step
                    sh 'ssh root@${TARGET_IP} "uname -a"'
                
                    // Kill gunicorn
                    sh 'ssh root@${TARGET_IP} ".${VIRTUALENV_DIR}/bin/gunicorn_stop"'
                    // always returns 1 :(

                    // Setup deployment dir
                    sh 'ssh root@${TARGET_IP} "rm -rf ${DEPLOY_DIR}/*"'

                    // STFP and extract zip file
                    sh 'echo "put ./${ZIP_FILE} ${DEPLOY_DIR}/" | sftp root@${TARGET_IP}'
                    sh 'ssh root@${TARGET_IP} "tar -zxvf ${DEPLOY_DIR}/${ZIP_FILE} --directory ${DEPLOY_DIR}/"'
                    sh 'ssh root@${TARGET_IP} "rm ${DEPLOY_DIR}/${ZIP_FILE}"'
                    // sh 'ssh root@${TARGET_IP} "chown www-data: ${DEPLOY_DIR}"'

                    // Set allowed hosts - stomp other env vars :(
                    //sh 'printf "PATH=$PATH\nALLOWED_HOST=${TARGET_IP}" > /etc/environment'
    
                    // Setup Django
                    // sh 'ssh root@${TARGET_IP} "source ${VIRTUALENV_DIR}/bin/activate"'
                    // sh 'ssh root@${TARGET_IP} "pip install -r ${DEPLOY_DIR}/requirements.txt"'
                    // sh 'ssh root@${TARGET_IP} "python ${DEPLOY_DIR}/manage.py migrate"'

                    // withEnv(["ALLOWED_HOSTS=\'${ALLOWED_HOSTS}\'"]) {
                    //     sh 'ssh root@${TARGET_IP} "gunicorn --daemon --pythonpath ${PYTHONPATH} links.wsgi"'
                    // }

                    // sh 'ssh root@${TARGET_IP} ".${VIRTUALENV_DIR}/bin/gunicorn_start"'
                }
            }
        }
    }
}

