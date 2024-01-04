pipeline {
  agent any
  stages {
      stage('SCM') {
          steps {
              checkout scm
          }
      }
      stage('Run Tests') {
         steps {
          dir('backend/media') {
             sh './gradlew test'
          }
        }
      }
      stage('SQ Media Analysis') {
          steps {
              echo 'Analyzing with Sonarqube...'
              load "$JENKINS_HOME/.envvars/envVarsTest.groovy"
                dir('backend/media') {
                  withSonarQubeEnv('sonarqube') {
                    sh "./gradlew sonar"
                  }
                }
          }
      }
      stage('SQ Media Quality Gate') {
        steps {
            sleep 5
            timeout(time: 1, unit: 'HOURS') {
                waitForQualityGate abortPipeline: true
            }
        }
      }
      stage('Check Security Vulnerabilities') {
          steps {
              script {
                def result = sh(script: 'node requests/media.js', returnStdout: true, returnStatus: true)
                if (result == 0) {
                    echo 'No security vulnerabilities found'
                } else {
                    error('Security vulnerabilities found')
                }
              }
          }
      }
  }
}
