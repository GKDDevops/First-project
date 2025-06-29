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
    DEPLOYMENT_DIR = "deployment"
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

              # Replace image tags in manifest files
              sed -i "s|<TAGG>|${BUILD_NUMBER}|g" $DEPLOYMENT_DIR/frontend.yaml
              sed -i "s|<TAGG>|${BUILD_NUMBER}|g" $DEPLOYMENT_DIR/backend.yaml

              # Apply all manifests in the deployment directory
              kubectl apply -f $DEPLOYMENT_DIR -n $NAMESPACE

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
