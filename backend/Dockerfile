# Build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
# Use Maven wrapper (ensure mvnw is executable in git: chmod +x backend/mvnw)
RUN ./mvnw -q -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/taskmanager-0.0.1-SNAPSHOT.jar app.jar
# Expose internal port (Render uses PORT env var anyway)
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
