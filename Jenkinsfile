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

        stage('Deploy to Private EC2 via SSM') {
            steps {
                sh """
                    aws ssm send-command \
                        --instance-ids "${PRIVATE_EC2_INSTANCE_ID}" \
                        --document-name "AWS-RunShellScript" \
                        --parameters commands="
                            # Login to ECR
                            aws ecr get-login-password --region ${AWS_REGION} | \\
                            docker login --username AWS --password-stdin ${ECR_REPO}
                            
                            # Pull latest images
                            docker pull ${ECR_REPO}/${IMAGE_NAME_SPRING}:latest
                            docker pull ${ECR_REPO}/${IMAGE_NAME_NODE}:latest
                            
                            # Stop and remove old containers
                            docker stop spring-app node-app 2>/dev/null || true
                            docker rm spring-app node-app 2>/dev/null || true
                            
                            # Run Spring Boot container
                            docker run -d \\
                                --name spring-app \\
                                --restart always \\
                                -p 8080:8080 \\
                                ${ECR_REPO}/${IMAGE_NAME_SPRING}:latest
                            
                            # Run Node.js container
                            docker run -d \\
                                --name node-app \\
                                --restart always \\
                                -p 3000:3000 \\
                                ${ECR_REPO}/${IMAGE_NAME_NODE}:latest
                            
                            # Verify containers are running
                            echo '=== Running Containers ==='
                            docker ps
                        " \
                        --region ${AWS_REGION} \
                        --output text
                    
                    echo "SSM command sent successfully. Waiting for execution..."
                    sleep 10
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Success! Images deployed to private EC2"
            echo "Spring Boot: http://10.0.2.124:8080"
            echo "Node.js: http://10.0.2.124:3000"
        }
        failure {
            echo "❌ Pipeline Failed!"
        }
    }
}
