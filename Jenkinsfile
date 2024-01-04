pipeline {
  agent any
  stages {
      stage('SCM') {
          steps {
              checkout scm
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
  }
}
