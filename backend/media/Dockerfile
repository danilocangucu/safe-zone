# Build stage
FROM openjdk:17-slim AS build
LABEL maintainer="nonono"
WORKDIR /workspace

# Install necessary tools
# Update the package list, install wget, unzip for Gradle installation, and dos2unix
RUN apt-get update && apt-get install -y wget unzip dos2unix

# Install Gradle
ENV GRADLE_VERSION 8.5
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp
RUN unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip
ENV GRADLE_HOME /opt/gradle/gradle-${GRADLE_VERSION}
ENV PATH ${GRADLE_HOME}/bin:${PATH}

# Copy the project files
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Build the project
RUN gradle build

# Run stage
FROM openjdk:17
LABEL maintainer="nonono"
VOLUME /tmp
EXPOSE 447

# Copy the built jar file from the build stage
COPY --from=build /workspace/build/libs/media-0.0.1-SNAPSHOT.jar media-ms.jar

# Environment variables for MongoDB URI and database
ENV SPRING_DATA_MONGODB_URI=mongodb+srv://admin:admin@cluster0.9sbwdo2.mongodb.net/
ENV SPRING_DATA_MONGODB_DATABASE=buy-01_media


# Run the jar file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/media-ms.jar"]
