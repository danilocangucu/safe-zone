pipeline {
  agent any
  stages {
      stage('SCM') {
          steps {
              checkout scm
          }
      }
      stage('SonarQube Analysis') {
          steps {
              echo 'Analyzing with Sonarqube...'
              load "$JENKINS_HOME/.envvars/envVarsTest.groovy"
                dir('backend/media') {
                  withSonarQubeEnv('sonarqube') {
                    sh "./gradlew sonar"
                  }
                }
                dir('backend/users') {
                  withSonarQubeEnv('sonarqube') {
                    sh "./gradlew sonar"
                  }
                }
                dir('backend/products') {
                  withSonarQubeEnv('sonarqube') {
                    sh "./gradlew sonar"
                  }
                }
                dir('frontend') {
                  steps {
                    def scannerHome = tool 'SonarScanner';
                    withSonarQubeEnv('sonarqube') {
                      sh "${scannerHome}/bin/sonar-scanner"
                    }
                  }
                }
          }
      }
  }
}
