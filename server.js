const express = require('express');
const path = require('path');

//const opn = require('opn')

const app = express()
const port = 8081

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.use(allowCrossDomain)
app.use('/', express.static(__dirname))
app.get('/checkin*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
  //opn(`http://localhost:${port}`)
})
