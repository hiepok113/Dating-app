# Chạy quá trình build Maven trong môi trường Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Chạy ứng dụng bằng JRE nhẹ
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar file
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render sẽ tự map tới biến môi trường PORT)
EXPOSE 8080

# Chạy app
ENTRYPOINT ["java", "-jar", "app.jar"]
