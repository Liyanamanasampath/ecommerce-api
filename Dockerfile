#use base image
FROM node:20-alpine

#workDirectory
WORKDIR /app

#add packge and package json file
COPY package*.json ./

#run the depedencies
RUN npm install 

#copy files
COPY . .

#expose files
EXPOSE 5000 

CMD [ "npm" ,"start" ]
