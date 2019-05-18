const express = require('express');
const { setup } = require('radiks-server');
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
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
  //opn(`http://localhost:${port}`)
})


setup().then((RadiksController) => {
  console.log("radiks server middleware added", RadiksController);
  app.use('/radiks', RadiksController);
});

/*const readCollection = async ()=>{
	const { getDB } = require('radiks-server');
	const mongo = await getDB('mongodb://127.0.0.1:27017/radiks-server');
	let collections = await mongo.collections();
	collections.forEach(collection=>{
		collection.find().forEach((doc)=>console.log(doc))
	});
}

readCollection();*/