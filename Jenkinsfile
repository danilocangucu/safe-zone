pipeline {
   agent any
   stages {
       stage('Build') {
           steps {
              sh 'docker compose --env-file .env.test build'
           }
       }
       stage('Test') {
           steps {
               load "$JENKINS_HOME/.envvars/envVarsTest.groovy"
               echo 'Testing...'
               sh 'docker compose --env-file .env.test up -d'
               echo 'Users MS...'
               dir('backend/users') {
                sh './gradlew test'
               }
               echo 'Products MS...'
               dir('backend/products') {
                sh './gradlew test'
               }
               echo 'Media MS...'
               dir('backend/media') {
                sh './gradlew test'
               }
               echo 'Frontend...' 
               dir('frontend') {
                sh 'npm install'
                sh 'npm test'
               }
               sh 'docker compose --env-file .env.test down'
           }
       }
       stage('Deploy') {
        steps {
            load "$JENKINS_HOME/.envvars/envVarsDeploy.groovy"
            sh "docker compose --env-file .env.deploy up -d"
        }
        }
    }
    post {
            always {
                emailext attachLog: true, body: 'Project: $PROJECT_NAME\nBuild #: $BUILD_NUMBER\nStatus: $BUILD_STATUS\nCheck console output at $BUILD_URL to view the results or read the attached log file.', subject: 'Build $BUILD_NUMBER: $BUILD_STATUS', to: 'danilojenkins@zohomail.eu'
            }
    }
}
