cat > /var/lib/jenkins/workspace/project/springapp/springapp/Dockerfile << 'EOF'
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/*.jar"]
EOF
