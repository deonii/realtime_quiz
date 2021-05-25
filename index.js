const express 	 = require('express')
const app     	 = express();
const http 	 = require('http').createServer(app);
const { Client } = require('pg');
const Query 	 = require('pg').Query;
const jwt 	 = require('jsonwebtoken');
const bcrypt 	 = require('bcrypt')
const secretKey  = require('./config/my_settings').secretKey;
const algorithm  = require('./config/my_settings').algorithm;
const expiresIn  = require('./config/my_settings').expiresIn;
const clientInfo = require('./config/my_settings').clientInfo;

const client 	 = new Client(clientInfo)

app.use(express.json())

http.listen(8000, ()=>{
        console.log('8000 server open')
})

client.connect(err => {
	if(err) {
		console.error('connection error', err.stack)
	} else {
		console.log('Database connected')
	}
})


app.post('/admin-login', function(req,res){
        let password = req.body.password
        let query    = `select password from admins where id=1;`

        client.query(query, function(err,result){
                if(err) throw err
                else{
                        hash = result.rows[0].password
                        bcrypt.compare(password, hash, function(err, result) {
                                if(err) throw err
                                else {
                                        if(result == true) {
						var token = jwt.sign({ user_id : 1}, secretKey,{expiresIn : expiresIn})
						res.send({'token':token})
					} else {
						res.send({"Message": "Invalid_paasword"})
					}
                                }
			});
                }
        });
});


app.get('/movie-url', function(req, res){
	let language = req.query.language;
	let query    = `select movie-url from languages where language=${language}`

	client.query(query, function(err, result){
		if(err){
			res.send({"Message" : "Invalid_Language"})
		} else {
			res.send({'movie-url' : result.rows[0].movie-url})
		}
	})
})




var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3000});

wss.on("connection", function(ws) {
        console.log('Websocket 연결 성공')
  ws.on("message", function(message) {
          ws.send(message);
  });
});
