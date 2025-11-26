pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'git', url: 'https://github.com/parii-star/-MySecondProject.git'
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