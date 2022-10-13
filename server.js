const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.listen(port, () => console.info(`Linstening on ${port}`));
