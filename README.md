# Social Network web services
by
Ludovic Tichit

###Presentation
This project, in the course of Web Services during the second year of the university's Master Donnée et Systèmes Connectés at Jean Monnet Saint-Etienne, is to develop a web platform providing some web services to imitate a social network platform.

###Composants
Back end application is realized with Node.js, in particular with the framework Express 4.
Database is realised with NoSQL, hosted on MongoLab (https://mlab.com/databases/webservicessocialnetwork), and linked with the project in db.js file.

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
Go on localhost:3030/

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
Will be coming soon !

###Ressources
Some good JavaScript practices for Node.js are extracted from [Julien Muetton courses](http://edu.muetton.me/) and from my own experience (internship...)
