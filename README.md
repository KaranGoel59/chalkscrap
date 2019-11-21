# Scrapper for chalkpad hp

This is a basic chalkpad scrapper and can  get 
1) student info
2) course info
3) timetable
4) teacher name


## How to run

```
yarn install
```
or 
```
npm install
```

It uses chromium to scrap dynamic data so wait until it is downloaded<br/>

now
```
yarn dev
```
It will start the scrapper in development mode at localhost <br/>

You can config the port from .env file or src/config
```
NODE_ENV=development
PORT=5000
CONCURRENCY=5
```
Concurrency is the limit on the number of  chromium tabs the scrapper can open at one time

## How to scrap data

This Scrapper use socket  for un-timed-out network requests, thus it is able to handle any number of users even in heavy traffic <br/>

Here is a sample code to send request to scrapper

```
var  _  =  require('lodash');

var  io  =  require('socket.io-client');
var  socket  =  io.connect("http://localhost:5000",  {
	reconnection:  true
});

const  password  =  'password';
let  id  =  '171198****'
socket.on('connect',  function  ()  {
	console.log('connected to localhost:5000');
	socket.emit('student',{id: id, password:password});
});
``` 

run this code and check the server.<br/>

If you like this project feel free to contribue 