pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '962328866838.dkr.ecr.ap-south-1.amazonaws.com'
        IMAGE_NAME_NODE = 'nodeapp'
        IMAGE_NAME_SPRING = 'springapp'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Lakshmi33923/capstone-project2.git'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ECR_REPO
                '''
            }
        }

        stage('Build Spring Boot Image') {
            steps {
                sh '''
                cd springapp
                mvn clean package
                docker build -t $IMAGE_NAME_SPRING .
                docker tag $IMAGE_NAME_SPRING:latest $ECR_REPO/$IMAGE_NAME_SPRING:latest
                '''
            }
        }

        stage('Build Node Image') {
            steps {
                sh '''
                cd nodeapp
                docker build -t $IMAGE_NAME_NODE .
                docker tag $IMAGE_NAME_NODE:latest $ECR_REPO/$IMAGE_NAME_NODE:latest
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push $ECR_REPO/$IMAGE_NAME_SPRING:latest
                docker push $ECR_REPO/$IMAGE_NAME_NODE:latest
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Success!"
        }
        failure {
            echo "❌ Pipeline Failed!"
        }
    }
}
