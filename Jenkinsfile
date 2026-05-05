pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '962328866838.dkr.ecr.ap-south-1.amazonaws.com'
        IMAGE_NAME_NODE = 'nodeapp'
        IMAGE_NAME_SPRING = 'springapp'
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

        stage('Deploy to Private EC2') {
            steps {
                sh '''
                    aws ssm send-command \
                        --instance-ids i-08c66a543c82611b8 \
                        --document-name "AWS-RunShellScript" \
                        --parameters commands="
                            # Login to ECR
                            aws ecr get-login-password --region ap-south-1 | \\
                            docker login --username AWS --password-stdin 962328866838.dkr.ecr.ap-south-1.amazonaws.com
                            
                            # Pull latest images
                            docker pull 962328866838.dkr.ecr.ap-south-1.amazonaws.com/spring-app:latest
                            docker pull 962328866838.dkr.ecr.ap-south-1.amazonaws.com/node-app:latest
                            
                            # Stop and remove old containers
                            docker stop spring-app node-app 2>/dev/null || true
                            docker rm spring-app node-app 2>/dev/null || true
                            
                            # Run Spring Boot container
                            docker run -d \\
                                --name spring-app \\
                                --restart always \\
                                -p 8080:8080 \\
                                962328866838.dkr.ecr.ap-south-1.amazonaws.com/spring-app:latest
                            
                            # Run Node.js container
                            docker run -d \\
                                --name node-app \\
                                --restart always \\
                                -p 3000:3000 \\
                                962328866838.dkr.ecr.ap-south-1.amazonaws.com/node-app:latest
                            
                            # Verify containers
                            docker ps
                        " \
                        --region ap-south-1
                    
                    echo "Deployment command sent to private EC2"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Success! Images pushed to ECR and deployed to private EC2"
        }
        failure {
            echo "❌ Pipeline Failed!"
        }
    }
}
