const http = require('http'); //this 


let tasks = [
{ id: 1, name: "Review Node.js Tutorial", completed: false }
];
let nextId = 2;


//this 
const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.end('Server is running... I think this is going easy and little bit complicated task in this summer class..');
  }

  if (req.method === 'GET' && req.url === '/task') {
    res.statusCode = 200;
    res.end(JSON.stringify(tasks));
  }else if (req.method === 'POST' && req.url === '/task') {
    
  }

});

//this (where this is writen mean these are the main part of to create a server..)
server.listen(5000, '127.0.0.1', () => {
  console.log('Server is running on port 5000');
});
