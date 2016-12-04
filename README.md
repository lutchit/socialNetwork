# Social Network web services
by
Ludovic Tichit

###Presentation
This project, in the course of Web Services during the second year of the university's Master Donnée et Systèmes Connectés at Jean Monnet Saint-Etienne, is to develop a web platform providing some web services to imitate a social network platform like [Meetup](www.meetup.com).

###Composants
Back end application is realized with Node.js, in particular with the framework Express 4.
Database is realised with NoSQL, hosted on MongoLab (https://mlab.com/databases/webservicessocialnetwork), and linked with the project in db.js file.
The [API.md](https://github.com/lutchit/socialNetwork/blob/master/API.md) is the API documentation of this application.
Moreover, the SocialNetwork.postman_collection file allows you to test easily all the REST methods. Please note that Token are valids for 24 hours only, so don't forget to change it in the requests furnished in the file.

###Warning
MongoLab is blocked by Eduroam and Eduspot, if you want to test the app in local, test with you own wifi access.

###Installation
No difficulties in the installation. Let's do it !

Get the source code :
```
git clone https://github.com/lutchit/socialNetwork.git 
```

Install the dependencies :
```
npm install
```

Launch the project :
```
npm start
```
Go on localhost:3000

And voila, no much more !

It is possible to launch project in development mode, which eases code modification relaunching project each time a file is modified:
```
npm run dev
```

To run the tests, use the following command :
```
npm test
```
Istanbul allows to see how much the files are covered by the tests.

###Online version

https://webservicesputeem.herokuapp.com

###Ressources
Some good JavaScript practices for Node.js are extracted from [Julien Muetton courses](http://edu.muetton.me/) and from my own experience (internship...)
Authentication tutorial from [Devdactic](http://devdactic.com/restful-api-user-authentication-2/)
