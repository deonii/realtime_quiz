const express 	 = require('express')
const app     	 = express();
const http 	 = require('http').createServer(app);
const { Client } = require('pg');
const Query 	 = require('pg').Query;
const jwt 	 = require('jsonwebtoken');
const bcrypt 	 = require('bcrypt')
const saltRounds = 10;
const secretKey  = "q1w2e3r4";
const algorithm  = "HS256";
const expiresIn  = "30m";

const client = new Client({
	user 	 : 'fishingman99',
	host 	 : 'localhost',
	database : 'testdb',
	password : '1q2w3e4r',
	port 	 : 5432
})

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


app.post('/login-admin', function(req,res){
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
						res.send({'result' : 'WRONG_PASSWORD'})
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
			res.send({'result':'error'})
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
