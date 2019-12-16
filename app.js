// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create an instance of express to serve our end points
const app = express();

// configure our express instance with some body-parser settings 
// including handling JSON data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
app.use('/api/contacts', require('./routes/contacts'));

// finally, launch our server on port 3001.
const server = app.listen(3001, () => {
    console.log('App listening on port: ', server.address().port);
});

module.exports = app;