# Build stage
FROM maven:3.8.6-openjdk-18 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY backend/src ./src
RUN mvn package -DskipTests

# Run stage
FROM openjdk:18-jdk-slim
WORKDIR /app
# Updated to match your actual JAR filename
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]