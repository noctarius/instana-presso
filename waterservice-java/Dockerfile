FROM openjdk:8-jre-alpine

RUN mkdir /root/app
COPY target/waterservice-0.0.1-SNAPSHOT.jar /root/app/app.jar

WORKDIR /root/app

EXPOSE 3000

CMD ["java", "-jar", "/root/app/app.jar"]
