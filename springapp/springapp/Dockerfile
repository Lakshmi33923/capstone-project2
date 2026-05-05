 Step 1: Use official Java runtime image
FROM openjdk:17-jdk-slim

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy the JAR file into the container
COPY target/*.jar app.jar

# Step 4: Expose application port (default Spring Boot port)
EXPOSE 8080

# Step 5: Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]


