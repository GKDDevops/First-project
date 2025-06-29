pipeline {
  agent {
    kubernetes {
      label 'docker-gcloud-agent'
      yamlFile 'pod-template.yaml'
    }
  }

  environment {
    REGISTRY = 'us-central1-docker.pkg.dev/euphoric-oath-463913-c3/tododevops'
    FRONTEND_IMAGE = "${REGISTRY}/tododevops-frontend:${BUILD_NUMBER}"
    BACKEND_IMAGE  = "${REGISTRY}/tododevops-backend:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git(
          branch: 'develop',
          url: 'https://github.com/GKDDevops/First-project.git',
          credentialsId: 'github-credentials'
        )
      }
    }

    stage('Build Docker Images') {
      steps {
        container('docker') {
          sh "docker --version"
          sh "docker build -t $FRONTEND_IMAGE -f ./frontend/Dockerfile ./frontend"
          sh "docker build -t $BACKEND_IMAGE -f ./backend/Dockerfile ./backend"
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        container('docker') {
          withCredentials([file(credentialsId: 'gcp-jenkins-sa', variable: 'GC_KEY')]) {
            script {
              // Authenticate with GCP and configure Docker for Artifact Registry
              sh '''
                gcloud auth activate-service-account --key-file=$GC_KEY
                gcloud auth configure-docker us-central1-docker.pkg.dev
              '''
              // Try to push images, fail with clear message if unauthenticated
              def pushStatus = sh(
                script: """
                  docker push $FRONTEND_IMAGE || exit 1
                  docker push $BACKEND_IMAGE || exit 1
                """,
                returnStatus: true
              )
              if (pushStatus != 0) {
                error '''
                Docker push failed. 
                Please ensure:
                - The service account has the Artifact Registry Writer role[2][5].
                - The repository exists and the name is correct.
                - Authentication is properly configured.
                '''
              }
            }
          }
        }
      }
    }

    stage('Deploy to GKE') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        container('docker') {
          withCredentials([file(credentialsId: 'gcp-jenkins-sa', variable: 'GC_KEY')]) {
        //    sh '''
              gcloud auth activate-service-account --key-file=$GC_KEY
              gcloud container clusters get-credentials <CLUSTER_NAME> --zone <ZONE> --project <PROJECT_ID>
              kubectl set image deployment/frontend frontend=$FRONTEND_IMAGE
              kubectl set image deployment/backend backend=$BACKEND_IMAGE
              kubectl rollout status deployment/frontend
              kubectl rollout status deployment/backend
            '''
          }
        }
      }
    }
  }

  post {
    always {
      // Use deleteDir() instead of cleanWs() for workspace cleanup[3]
      deleteDir()
    }
  }
}

