pipeline {
    agent any
    environment {
        GCP_PROJECT = 'kinetic-bot-473806-n6'
        GCP_REGION = 'asia-south2'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'Second_pro_token', url: 'https://github.com/parii-star/-MySecondProject.git'
            }
        }
        stage('GCP Service Account Auth') {
            steps {
                withCredentials([file(credentialsId: 'GCP_SA-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''#!/bin/bash
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $GCP_PROJECT
                    gcloud config set compute/region $GCP_REGION
                    gcloud auth configure-docker asia-south2-docker.pkg.dev --quiet
                    '''
                }
            }
        }
        stage('Build & Push Backend Image') {
            steps {
                withCredentials([file(credentialsId: 'GCP_SA-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''#!/bin/bash
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $GCP_PROJECT
                    docker build -t asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest ./backend
                    docker push asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest
                    '''
                }
            }
        }
        stage('Build & Push Frontend Image') {
            steps {
                withCredentials([file(credentialsId: 'GCP_SA-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''#!/bin/bash
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $GCP_PROJECT
                    docker build --no-cache -t asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest --build-arg VITE_API_BASE_URL=https://backend-902316902825.asia-south2.run.app/api ./frontend
                    docker push asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest
                    '''
                }
            }
        }
        stage('Deploy Backend to Cloud Run') {
            steps {
                withCredentials([file(credentialsId: 'GCP_SA-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''#!/bin/bash
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $GCP_PROJECT
                    gcloud run deploy backend \
                      --image=asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest \
                      --region=asia-south2 \
                      --platform=managed \
                      --allow-unauthenticated \
                      --add-cloudsql-instances=kinetic-bot-473806-n6:asia-south2:mysecondprojectdb \
                      --update-env-vars=DB_SOCKET_PATH=/cloudsql/kinetic-bot-473806-n6:asia-south2:mysecondprojectdb,DB_USER=mysecondprojectuser,DB_PASSWORD=Pari@2004,DB_NAME=postgres,ALLOWED_ORIGINS=https://frontend-902316902825.asia-south2.run.app \
                      --max-instances=10 \
                      --min-instances=0 \
                      --memory=512Mi
                    '''
                }
            }
        }
        stage('Deploy Frontend to Cloud Run') {
            steps {
                withCredentials([file(credentialsId: 'GCP_SA-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''#!/bin/bash
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $GCP_PROJECT
                    gcloud run deploy frontend \
                      --image=asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest \
                      --region=asia-south2 \
                      --platform=managed \
                      --allow-unauthenticated \
                      --port=8080 \
                      --max-instances=10 \
                      --min-instances=0 \
                      --memory=256Mi
                    '''
                }
            }
        }
        stage('Show Service URLs') {
            steps {
                echo 'Backend running at https://backend-902316902825.asia-south2.run.app'
                echo 'Frontend running at https://frontend-902316902825.asia-south2.run.app'
            }
        }
    }
}