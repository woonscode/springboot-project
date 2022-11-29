# IS442 Object-Oriented Programming

## Description:
This is a springboot backend application that will be used to create a RESTful API for a web application.

## Folder Directory:
```
📦backend
 ┣ 📂.mvn
 ┃ ┗ 📂wrapper
 ┃ ┃ ┣ 📜maven-wrapper.jar
 ┃ ┃ ┗ 📜maven-wrapper.properties
 ┣ 📦src
 ┣ 📂main
 ┃ ┣ 📂java
 ┃ ┃ ┗ 📂is442g1t3
 ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┗ 📜Config.java
 ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┣ 📜AuthController.java
 ┃ ┃ ┃ ┃ ┣ 📜DestinationController.java
 ┃ ┃ ┃ ┃ ┣ 📜EmailController.java
 ┃ ┃ ┃ ┃ ┣ 📜LoanController.java
 ┃ ┃ ┃ ┃ ┣ 📜PDFExportController.java
 ┃ ┃ ┃ ┃ ┣ 📜PassController.java
 ┃ ┃ ┃ ┃ ┣ 📜StatisticsController.java
 ┃ ┃ ┃ ┃ ┣ 📜TemplateController.java
 ┃ ┃ ┃ ┃ ┣ 📜UserController.java
 ┃ ┃ ┃ ┃ ┗ 📜WaitlistController.java
 ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┣ 📜CollectionReminderEmailQueue.java
 ┃ ┃ ┃ ┃ ┣ 📜Destination.java
 ┃ ┃ ┃ ┃ ┣ 📜DigitalPass.java
 ┃ ┃ ┃ ┃ ┣ 📜EmailMessage.java
 ┃ ┃ ┃ ┃ ┣ 📜EmailQueue.java
 ┃ ┃ ┃ ┃ ┣ 📜InviteLink.java
 ┃ ┃ ┃ ┃ ┣ 📜JWT.java
 ┃ ┃ ┃ ┃ ┣ 📜Loan.java
 ┃ ┃ ┃ ┃ ┣ 📜Pass.java
 ┃ ┃ ┃ ┃ ┣ 📜PasswordHash.java
 ┃ ┃ ┃ ┃ ┣ 📜PaymentReminderEmailQueue.java
 ┃ ┃ ┃ ┃ ┣ 📜PhysicalPass.java
 ┃ ┃ ┃ ┃ ┣ 📜ReturnReminderEmailQueue.java
 ┃ ┃ ┃ ┃ ┣ 📜Role.java
 ┃ ┃ ┃ ┃ ┣ 📜User.java
 ┃ ┃ ┃ ┃ ┗ 📜WaitList.java
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┣ 📜DestinationRequest.java
 ┃ ┃ ┃ ┃ ┣ 📜DestinationResponse.java
 ┃ ┃ ┃ ┃ ┣ 📜LoanWithPass.java
 ┃ ┃ ┃ ┃ ┣ 📜LoginRequest.java
 ┃ ┃ ┃ ┃ ┣ 📜PDFRequest.java
 ┃ ┃ ┃ ┃ ┣ 📜ResponseSchema.java
 ┃ ┃ ┃ ┃ ┣ 📜SignupRequest.java
 ┃ ┃ ┃ ┃ ┣ 📜UserDetailsResponse.java
 ┃ ┃ ┃ ┃ ┗ 📜WaitListRequest.java
 ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┣ 📜CollectionReminderEmailQueueRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜DestinationRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜EmailQueueRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜InviteLinkRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜LoanRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜PassRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜PasswordHashRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜PaymentReminderEmailQueueRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜ReturnReminderQueueRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜RoleRepo.java
 ┃ ┃ ┃ ┃ ┣ 📜UserRepo.java
 ┃ ┃ ┃ ┃ ┗ 📜WaitListRepo.java
 ┃ ┃ ┃ ┣ 📂security
 ┃ ┃ ┃ ┃ ┣ 📜CustomFilter.java
 ┃ ┃ ┃ ┃ ┗ 📜WebSecurityConfig.java
 ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┣ 📜AuthService.java
 ┃ ┃ ┃ ┃ ┣ 📜DestinationService.java
 ┃ ┃ ┃ ┃ ┣ 📜EmailQueueService.java
 ┃ ┃ ┃ ┃ ┣ 📜EmailSender.java
 ┃ ┃ ┃ ┃ ┣ 📜InviteLinkService.java
 ┃ ┃ ┃ ┃ ┣ 📜JwtService.java
 ┃ ┃ ┃ ┃ ┣ 📜LoanService.java
 ┃ ┃ ┃ ┃ ┣ 📜PDFGenerator.java
 ┃ ┃ ┃ ┃ ┣ 📜PassService.java
 ┃ ┃ ┃ ┃ ┣ 📜PasswordService.java
 ┃ ┃ ┃ ┃ ┣ 📜StatisticsService.java
 ┃ ┃ ┃ ┃ ┣ 📜UserService.java
 ┃ ┃ ┃ ┃ ┗ 📜WaitListService.java
 ┃ ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┃ ┗ 📜CipherUtility.java
 ┃ ┃ ┃ ┗ 📜Is442g1t3Application.java
 ┃ ┗ 📂resources
 ┃ ┃ ┣ 📂META-INF
 ┃ ┃ ┃ ┗ 📜additional-spring-configuration-metadata.json
 ┃ ┃ ┣ 📂static
 ┃ ┃ ┃ ┗ 📜mobilemeep2.jpeg
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┣ 📜application.properties
 ┃ ┃ ┗ 📜data.sql
 ┗ 📂test
 ┃ ┗ 📂java
 ┃ ┃ ┗ 📂is442g1t3
 ┃ ┃ ┃ ┗ 📜Is442g1t3ApplicationTests.java
 ┃ ┗ 📂test (for automated testing - not in use)
 ┃ ┃ ┗ 📂java
 ┃ ┃ ┃ ┗ 📂is442g1t3
 ┃ ┃ ┃ ┃ ┗ 📜Is442g1t3ApplicationTests.java
 ┣ 📜.gitignore
 ┣ 📜Readme.md
 ┣ 📜mvnw (used to run maven commands to run app)
 ┣ 📜mvnw.cmd
 ┗ 📜pom.xml (file that tracks new dependencies)
```


## Installation:
1. Git pull the entire project
2. Start MySQL Server locally, and create a schema for your db and update the ```/src/main/resources/application.properties``` file with the correct information:
   - Replace the value of localhost, port and dbname
     - ```spring.datasource.url=jdbc:mysql://${MYSQL_HOST:<your_host_url>}:${MYSQL_PORT:<your_mysql_port>}/${MYSQL_DBL:<your_db_name>}?useSSL=false&serverTimezone=UTC```
   - Replace the value of username and password  
     - ```spring.datasource.username=${MYSQL_USER:<your_db_username>}```
     - ```spring.datasource.password=${MYSQL_PASSWORD:<your_db_password>}```
   - (Optional -for now) Replace the value of the smtp host, port, email and password for the email service
     - ```spring.mail.host=${MAIL_HOST:<actual_smtp_host>}```
     - ```spring.mail.port=${MAIL_PORT:<actual_smtp_port>}```
     - ```spring.mail.username=${EMAIL_USER:<actual email>}```
     - ```spring.mail.password=${EMAIL_PASSWORD:<actual app password>}```
   - Update in the environment variables, when it is deployed, this will be done through the deployment environment variables. But when done locally, update the application.properties file with the correct values.
     - ```# Enviroment variables
        my.secretkey=${SECRET_KEY:secretwqblwbrlkrjbwlbrwlqbjrljqbwrlbjqwlrbqlwrb}
        my.hashSecret=${HASH_SECRET:secretwqblwbrlkrjbwlbrwlqbjrljqbwrlbjqwlrbqlwrb}
        my.frontendUrl=${FRONTEND_URL:http://localhost:3000}```
    - Update the number of threads for multithreading (recommneded to keep thread count of 5 and above)
      - ```spring.task.scheduling.pool.size=5```
  
3. Ensure that you are in the backend folder and run the following command to build and run the app using Maven (first build might take a while):
- ```./mvnw spring-boot:run```
- Add the -X flag for more logs
  -  ```./mvnw spring-boot:run -X```

## Generating JavaDocs:
1. Ensure that you are in the backend folder and run the following command to generate the JavaDocs:
   - ```./mvnw javadoc:javadoc```
2. Your JavaDocs will be generated in the ```/target/site/apidocs``` folder.

## Deployment Options:
1. Docker
   - Dockerfile is included in the project root folder
   - Docker image can be built using the following command:
     - ```docker build -t is442g1t3 .```
   - Docker image can be run using the following command:
     - ```docker run -p 8080:8080 is442g1t3```
   - Docker image can be pushed to DockerHub using the following command:
     - ```docker push <your_dockerhub_username>/is442g1t3```
   - This image has a dependency on a MySQL database, so you will need to create a MySQL container and link it to the is442g1t3 container. You can do it through composing mutliple containers in a single docker-compose.yml file (local) or use kubectl to create pods using a deployment file (kubernetes) and deploy it to a kubernetes cluster.
   - For production, you can use a cloud provider such as AWS, Azure or GCP to deploy the docker image to a container service such as ECS, AKS or GKE.
   - Enviroment variables will be expected to be passed in through the deployment environment variables. 
   - A sample of the docker-compose.yml file is included in the project root folder.
