/*
Importing express library
*/
const express = require('express'); 

/*
Creates an express "app"
This is the server
Will add all the routes and logic onto here
*/
const app = express();

/*
Middleware to parse JSON body (for POST later)
so express is able to handle json bodies
*/
app.use(express.json());

/*
link main server to routes folder
*/
const slotsRouter = require('./routes/slots');
/*
switch to api bc industry standard, app.use any req
that starts with this path should be handles by this router
*/
app.use('/api/slots', slotsRouter);

/*
app.listen() turn the server ON and tell it to listen for
incoming requests

listen(port, callback)

“What door?” → the port
“What to do when open?” → callback function
*/
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});