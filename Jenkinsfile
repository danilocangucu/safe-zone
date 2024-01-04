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
      stage('Check Security Hotspots') {
        steps {
            script {
                def response = sh(script: '''
                    curl -s http://159.89.21.149:9000/api/issues/search?componentKeys=danilocangucu_safe-zone_media&types=VULNERABILITY&token=**** | jq '.total'
                ''', returnStdout: true).trim()
                if (response != '0') {
                    error("Found ${response} security hotspots")
                }
            }
        }
      }
  }
}
