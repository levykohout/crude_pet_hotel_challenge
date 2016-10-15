var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var petsRouter =require('./routes/pets');
var ownerRouter=require('./routes/owners')
var statusRouter=require('./routes/status');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/pet', petsRouter);
app.use('/owner',ownerRouter);
app.use('/status',statusRouter);

// serve the index page at /
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/views/index.html'));
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Listening on port ', server.address().port);
});
