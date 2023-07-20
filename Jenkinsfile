@Library('jenkins-library') _
pipeline {
  agent {
    kubernetes(k8sAgent(resourceType: 'small', appType: 'NODE'))
  }
stages { 
  stage('Sonarqube Analysis') {
     steps {
        container('m2p-base-build') {
          sonarqubeAnalysis(env.WORKSPACE)
        }
      }
   }
   stage('OWASP Dependency Check Analysis') {
      steps {
        container('m2p-base-build') {
          runOwaspDependencyCheck(env.WORKSPACE)
        }
      }
    } 
    stage('Docker Build') {
      steps {
        container('m2p-base-kaniko') {
          buildDocker('m2pfintech01/m2p-loyalty-program-dashboard:' + env.GIT_COMMIT)
        }
      }
    }
   stage('Trivy - Container Image Scanning') {
      steps {
        container('m2p-base-build') {
          runTrivyAnalysis()
        }
      }
    }  
    stage('Docker Push') {
      steps {
        container('m2p-base-build') {
          pushDocker('m2pfintech01/m2p-loyalty-program-dashboard:' + env.GIT_COMMIT)
        }
      }
    }
  }
}