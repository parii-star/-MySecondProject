pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'Second_pro_token', url: 'https://github.com/parii-star/-MySecondProject.git'
            }
        }
        stage('Cleanup') {
            steps {
                sh '''#!/bin/bash
                # Stop and remove old containers and volumes
                docker-compose down -v || true
                docker system prune -f || true
                '''
            }
        }
        stage('Build Docker Images') {
            steps {
                sh '''#!/bin/bash
                docker build -t mysecondproject_backend:latest ./backend
                docker build -t mysecondproject_frontend:latest ./frontend
                '''
            }
        }
        stage('Deploy Locally') {
            steps {
                sh '''#!/bin/bash
                # Create backend .env if not present
                if [ ! -f backend/.env ]; then
                    cp backend/.env.example backend/.env
                fi
                # Create frontend .env if not present
                if [ ! -f frontend/.env ]; then
                    cp frontend/.env.example frontend/.env
                fi
                docker-compose up -d
                '''
            }
        }
        stage('Show Service URLs') {
            steps {
                echo 'Backend running at http://localhost:5000'
                echo 'Frontend running at http://localhost:3000'
            }
        }
    }
}