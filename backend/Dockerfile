#Stage 1
# initialize build and set base image for first stage
FROM maven:3.8.6-eclipse-temurin-17 as stage1
# speed up Maven JVM a bit
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
# set working directory
WORKDIR /app/springboot
# copy just pom.xml
COPY pom.xml .
# go-offline using the pom.xml
RUN mvn dependency:go-offline
# copy your other files
COPY ./src ./src
# copy data folder and subdirectories
COPY ./data ./data
# copy images folder
COPY ./images ./images

# compile the source code and package it in a jar file
RUN mvn clean install -Dmaven.test.skip=true

#Stage 2
# set base image for second stage
FROM amazoncorretto:17
# set deployment directory
WORKDIR /app/springboot
# copy over the built artifact from the maven image
COPY --from=stage1 /app/springboot/target/is442g1t3-0.0.1-SNAPSHOT.jar /app/springboot

# Specify the environment variables
# FRONTEND_URL
ARG MYSQL_HOST
ENV MYSQL_HOST=${MYSQL_HOST}

ARG MYSQL_PORT
ENV MYSQL_PORT=${MYSQL_PORT}

ARG MYSQL_DBL
ENV MYSQL_DBL=${MYSQL_DBL}

ARG MYSQL_USER
ENV MYSQL_USER=${MYSQL_USER}

ARG MYSQL_PASSWORD
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}

ARG SMTP_HOST
ENV SMTP_HOST=${SMTP_HOST}

ARG SMTP_PORT
ENV SMTP_PORT=${SMTP_PORT}

ARG SMTP_USERNAME
ENV SMTP_USERNAME=${SMTP_USERNAME}

ARG SMTP_PASSWORD
ENV SMTP_PASSWORD=${SMTP_PASSWORD}

ARG SECRET_KEY
ENV SECRET_KEY=${SECRET_KEY}

ARG HASH_SECRET
ENV HASH_SECRET=${HASH_SECRET}

# expose port 8080
EXPOSE 8080

# run the application
CMD ["java", "-jar", "is442g1t3-0.0.1-SNAPSHOT.jar"]

# Command to build the docker image
# docker build -t sjng1234/booking-management-backend:latest .