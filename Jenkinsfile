pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'

        ECR_REPO = '962328866838.dkr.ecr.ap-south-1.amazonaws.com'

        IMAGE_NAME_NODE = 'node-app'
        IMAGE_NAME_SPRING = 'spring-app'
        IMAGE_NAME_FASTAPI = 'fastapi-app'

        PRIVATE_EC2_INSTANCE_ID = 'i-08c66a543c82611b8'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Lakshmi33923/capstone-project2.git',
                    credentialsId: 'git-creds'
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
                cd springapp/springapp

                docker build -t $IMAGE_NAME_SPRING .

                docker tag $IMAGE_NAME_SPRING:latest \
                $ECR_REPO/$IMAGE_NAME_SPRING:latest
                '''
            }
        }

        stage('Build Node Image') {
            steps {
                sh '''
                cd nodeapp

                docker build -t $IMAGE_NAME_NODE .

                docker tag $IMAGE_NAME_NODE:latest \
                $ECR_REPO/$IMAGE_NAME_NODE:latest
                '''
            }
        }

        stage('Build FastAPI Image') {
            steps {
                sh '''
                cd fastapi_app

                docker build -t $IMAGE_NAME_FASTAPI .

                docker tag $IMAGE_NAME_FASTAPI:latest \
                $ECR_REPO/$IMAGE_NAME_FASTAPI:latest
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push $ECR_REPO/$IMAGE_NAME_SPRING:latest

                docker push $ECR_REPO/$IMAGE_NAME_NODE:latest

                docker push $ECR_REPO/$IMAGE_NAME_FASTAPI:latest
                '''
            }
        }

        stage('Deploy on Private EC2 using SSM') {
            steps {
                sh '''
                aws ssm send-command \
                  --instance-ids $PRIVATE_EC2_INSTANCE_ID \
                  --document-name "AWS-RunShellScript" \
                  --comment "Deploy Applications" \
                  --parameters 'commands=[
                  
                  "aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin '$ECR_REPO'",

                  "docker pull '$ECR_REPO'/'$IMAGE_NAME_SPRING':latest",
                  "docker pull '$ECR_REPO'/'$IMAGE_NAME_NODE':latest",
                  "docker pull '$ECR_REPO'/'$IMAGE_NAME_FASTAPI':latest",

                  "docker stop spring-container || true",
                  "docker rm spring-container || true",

                  "docker stop node-container || true",
                  "docker rm node-container || true",

                  "docker stop fastapi-container || true",
                  "docker rm fastapi-container || true",

                  "docker run -d --name spring-container -p 8080:8080 '$ECR_REPO'/'$IMAGE_NAME_SPRING':latest",

                  "docker run -d --name node-container -p 3000:3000 '$ECR_REPO'/'$IMAGE_NAME_NODE':latest",

                  "docker run -d --name fastapi-container -p 5000:5000 '$ECR_REPO'/'$IMAGE_NAME_FASTAPI':latest"

                  ]' \
                  --region $AWS_REGION
                '''
            }
        }
    }
}
