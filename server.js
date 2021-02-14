//remove "-addPug" in order to use
const express = require('express');
const path = require('path');
var app = express();
const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  res.render('index.html');
})


app.listen(port,()=>{
console.log("server running on port 3001");
});
