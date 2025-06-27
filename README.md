# Google-Authentication-nodejs
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fiwgyltsex0j5xr1lror.png)
In this project we simply use the passport google Strategy.
Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more. [reference](http://www.passportjs.org/)
Before we get start  assume that you have a good knowledge of JavaScript and Nodejs.
so without any further delay lets start 👍

## Google credentials 
First we have to get Google credentials .
To get credentials 'if don’t already have them '  go to [Google developer Console](https://console.developers.google.com/) 

>_1)create a new project 
>
>2)Select the project and click credentials and the select OAuth client ID
>
>3)Now Select Web Application in application type. 
>
>4)Input your app name or whatever else you like , in Authorized JavaScript origins add this line`http://localhost:3030 ` and in Authorized redirect URIs field add this line ` http://localhost:3030/auth/google/callback `  and the click to create . 
>
>5)Now copy your *Google client ID* and *Google client secret*_
[Help](https://developers.google.com/adwords/api/docs/guides/authentication)

## Lets Initialize the New Project

To initialize the new project you just need to create a new folder "App name" and open folder in visual studio (or any other IDE ) code or any other IDE and run the below code in command line
```javascript
 npm init  
```
Just fill the project name and any other detail or just skip. After the `package.json` file is generated .

## Structure of the project


## Install Dependencies

These are the Dependencies we need to install for our project.
```
bcrypt
dotenv
express
jsonwebtoken
mongoose
passport
passport-auth0
passport-facebook
passport-facebook-token
passport-google-oauth20
passport-local
```
Install Dependencies by write the below code in your terminal
```javascript
npm i bcrypt dotenv express jsonwebtoken mongoose passport passport-auth0 passport-facebook passport-facebook-token passport-google-oauth20 passport-local
```
## Setup App for run
To start the server automatically we just need to install Nodemon which restart server automatically when any change is detected
```javascript
npm start
```
Setup application for developer run and normal run. Just change the Script section with the below code in package.json.
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node server.js"
},
```
## Start local server

To start our app for testing/developer just simply type the following command in the command line:

```javascript
node server.js
```

#### The main work is start from there

You need to just put your google client id and secret in this file. And also the mongodb uri like(`mongodb://localhost:27017/`) if you are hosting mongodb from your system . if you are using [Mongodb Atlas](https://www.mongodb.com/cloud/atlas/) it like(`mongodb+srv://XXXX:XXXX@cluster0.obaan.mongodb.net/{DBNAME}?retryWrites=true&w=majority`)

file:`.env`

```
GOOGLE_CLIENT_ID=XXXXXXXXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXX
AUTH0_DOMAIN=google-XXXXXXXXXX
AUTH0_CLIENT_ID=XXXXXXXXXX
AUTH0_CLIENT_SECRET="XXXXXXXXXX"
FACEBOOK_CLIENT_ID=TU_CLIENT_ID_DE_FACEBOOK=XXXXXXXXXX
FACEBOOK_CLIENT_SECRET=TU_CLIENT_SECRET_DE_FACEBOOK=XXXXXXXXXX
MONGODB_SECRET=XXXXXXXXXX
PORT = XXXX
```

