pipeline {
  agent any
  stages {
      stage('Build') {
           steps {
              sh 'docker compose --env-file .env.test build'
           }
      }
      stage('SCM') {
          steps {
              checkout scm
          }
      }
      stage('SonarQube Analysis') {
          steps {
              echo 'Analyzing with Sonarqube...'
              load "$JENKINS_HOME/.envvars/envVarsTest.groovy"
                // dir('backend/media') {
                //   withSonarQubeEnv('sonarqube') {
                //     sh "./gradlew sonar"
                //   }
                // }
                dir('backend/users') {
                  withSonarQubeEnv('sonarqube') {
                    sh "./gradlew sonar"
                  }
                }
          }
      }
  }
}
