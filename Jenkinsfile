pipeline {
  agent {
    kubernetes {
      label 'cicd-agent'
      yamlFile 'pod-template.yaml'
    }
  }

  environment {
    REGISTRY = 'us-central1-docker.pkg.dev/euphoric-oath-463913-c3/tododevops'
    FRONTEND_IMAGE = "${REGISTRY}/tododevops-frontend:${BUILD_NUMBER}"
    BACKEND_IMAGE  = "${REGISTRY}/tododevops-backend:${BUILD_NUMBER}"
    CLUSTER_NAME = "my-first-cluster-1"
    ZONE = "us-central1-c"
    PROJECT_ID = "euphoric-oath-463913-c3"
    NAMESPACE = "develop-v1"
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
        container('cicd') {
          sh "docker --version"
          sh "git --version"
          sh "kubectl version --client"
          sh "gcloud --version"
          sh "node --version"
          sh "npm --version"
          sh "docker build -t $FRONTEND_IMAGE -f ./frontend/Dockerfile ./frontend"
          sh "docker build -t $BACKEND_IMAGE -f ./backend/Dockerfile ./backend"
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        container('cicd') {
          withCredentials([file(credentialsId: 'gcp-jenkins-sa', variable: 'GC_KEY')]) {
            sh '''
              gcloud auth activate-service-account --key-file=$GC_KEY
              gcloud auth configure-docker us-central1-docker.pkg.dev
              docker push $FRONTEND_IMAGE
              docker push $BACKEND_IMAGE
            '''
          }
        }
      }
    }

    stage('Deploy to GKE') {
      steps {
        container('cicd') {
          withCredentials([file(credentialsId: 'gcp-jenkins-sa', variable: 'GC_KEY')]) {
            sh '''
              gcloud auth activate-service-account --key-file=$GC_KEY
              gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID
              kubectl set image deployment/frontend frontend=$FRONTEND_IMAGE -n $NAMESPACE
              kubectl set image deployment/backend backend=$BACKEND_IMAGE -n $NAMESPACE
              kubectl rollout status deployment/frontend -n $NAMESPACE
              kubectl rollout status deployment/backend -n $NAMESPACE
            '''
          }
        }
      }
    }
  }

  post {
    always {
      deleteDir()
    }
  }
}
