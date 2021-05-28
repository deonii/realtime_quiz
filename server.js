const express 	 = require('express')
let app     	 = express();
const http 	 = require('http').createServer(app);
const { Client } = require('pg');
const Query 	 = require('pg').Query;
const jwt 	 = require('jsonwebtoken');
const bcrypt 	 = require('bcrypt')
const secretKey  = require('./config/my_settings').secretKey;
const algorithm  = require('./config/my_settings').algorithm;
const clientInfo = require('./config/my_settings').clientInfo;
const cors = require('cors')
var bodyParser = require('body-parser');


app.use(cors())
app.use(express.urlencoded({ extended : true }))
app.use(express.json())
const client 	 = new Client(clientInfo)


var server = http.listen(8000, "0.0.0.0",()=>{
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
	console.log(password)
        let query    = `select password from admins where id=1;`

        client.query(query, function(err,result){
                if(err) {
			res.status(400).json({"Message" : "Not_Found_Admin"})
		}
                else{
                        hash = result.rows[0].password
                        bcrypt.compare(password, hash, function(err, result) {
                                if(err) {
					res.status(400).json({"Message" : "KeyError"})
				}
                                else {
                                        if(result == true) {
						var token = jwt.sign({ "user_id" : 1, "language" : "ko"}, secretKey)
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
	if (language == null) {
		res.status(400).json({"Message" : "KeyError"})
	} else {
	let query    = `select movie_url from languages where language_type='${language}'`

	client.query(query, function(err, result){
		if(err) throw err 
		else {
			if (result.rows[0] != null) {
				res.json({'movie-url' : result.rows[0].movie_url})
			}  else {
				res.status(400).json({"Message" : "Invalid_Language"})
			}
		}
	})
	}
})

app.post('/users', function(req, res){
	console.log('유저 생성')
	let data  = req.body;
	console.log(data)
	let nickname = data.nickname;
	let platform = data.platform;
	let language_id = 0;
	
	if(data.language == 'ko') language_id=1;
	if(data.language == 'en') language_id=2;
	if(data.language == 'ru') language_id=3;
	if(data.language == 'th') language_id=4;
	if(data.language == 'tu') language_id=5;
	if(data.language == 'pt') language_id=6;
	if(data.language == 'zh') language_id=7;
	if(data.language == 'ja') language_id=8;
		
	if(nickname == null || platform == null || language_id == 0) {
                res.status(400).json({"Message" : "KeyError"})
        } else{

	let sql = `insert into users (nickname, language_id, device_type) values ($1, $2, $3) returning *`
	let params = [ nickname, language_id, platform ];
	client.query(sql, params, function(err, result){
		if(err) throw err
		else {
			let token = jwt.sign({
				"nickname" : nickname,
				"user_id" : result.rows[0].id, 
				"language" : data.language,
				"platform" : platform
			}, secretKey)
			res.json({"token" : token})
		}
	})
	}
})

app.get('/reward/:quizNum', function(req, res){
        let quizNum = req.params.quizNum;
	let token = req.get('Authorization')
	let user;
	try{
		user = jwt.verify(token, secretKey)
	} catch(error) {
		res.status(400).json({"Message" : "Invalid_Token"})
	}

	let language_id = 0;

        if(user.language == 'ko') language_id=1;
        if(user.language == 'en') language_id=2;
        if(user.language == 'ru') language_id=3;
        if(user.language == 'th') language_id=4;
        if(user.language == 'tu') language_id=5;
        if(user.language == 'pt') language_id=6;
        if(user.language == 'zh') language_id=7;
        if(user.language == 'ja') language_id=8;
	
	if((language_id) && (1<=quizNum) && (quizNum<=15)){
	
		let quiz_query = `select reward_id from quizes where quiz_seq=${quizNum} and language_id=${language_id}`
		client.query(quiz_query, function(err, result){
			if(err) throw err
			else {
				let reward_id = result.rows[0].reward_id;
				let query    = `select * from rewards where id=${reward_id}`
				client.query(query, function(err, result){
					if(err) throw err
					else {
						let return_result = {
							"status" : "보상응답확인",
							"quiz_num" : quizNum,
							"mobile_reward" : result.rows[0].mo_reward_name,
							"mobile_reward_url" : result.rows[0].mo_image_url,
							"PC_reward" : result.rows[0].pc_reward_name,
							"PC_reward_url" : result.rows[0].pc_image_url,
							"reward_rate" : result.rows[0].reward_rate
						}
						res.json(return_result)
					}
				})
			}
		})
	} else {
		res.status(400).json({"Message" : "KeyError"})
	}
})

app.get('/quiz/:quizNum', function(req, res){
	let quizNum = req.params.quizNum;
	let token = req.get('Authorization')
	let user;
        try{
                user = jwt.verify(token, secretKey)
        } catch(error) {
                res.status(400).json({"Message" : "Invalid_Token"})
        }

        let language_id = 0;

        if(user.language == 'ko') language_id=1;
        if(user.language == 'en') language_id=2;
        if(user.language == 'ru') language_id=3;
        if(user.language == 'th') language_id=4;
        if(user.language == 'tu') language_id=5;
        if(user.language == 'pt') language_id=6;
        if(user.language == 'zh') language_id=7;
        if(user.language == 'ja') language_id=8;

        if((language_id) && (1 <= quizNum) && (quizNum <= 15)){
        	let quiz_query = `select * from quizes where quiz_seq=${quizNum} and language_id=${language_id};`

		client.query(quiz_query, function(err, result){
			if(err) throw err
			else {
				let quiz_id = result.rows[0].id
				let quiz_content = result.rows[0].content
				let query = `select * from answers where quiz_id=${quiz_id};`
				client.query(query, function(err, result){
					if(err) throw err
					else {
						let return_answer = {
        	                                        "status" : "퀴즈시작응답",
                	                                "quiz_num" : quizNum,
                        	                        "quiz" : quiz_content,
                                	                "ans" : {},
							"is_answer" : {}
						}
						for (info of result.rows) {
							return_answer.ans[info.answer_seq] = info.answer
							return_answer.is_answer[info.answer_seq] = info.answer_status
						}
						res.json(return_answer)	
					}
				})
			}
		})
	} else {
		res.status(400).json({"Message" : "KeyError"})
	}
})

app.post('/quiz', function(req, res){
        let data  = req.body;
        let quizNum = data.quiz_num;
        let answer = data.answer;
        let token = req.get('Authorization')
	
	let user;
        try{
                user = jwt.verify(token, secretKey)
        } catch(error) {
                res.status(400).json({"Message" : "Invalid_Token"})
        }
	
	let user_id = user.user_id
	if ((1<= quizNum) && (quizNum <= 15)){
        	let sql = `insert into user_answers (user_id, quiz_id, is_answer) values ($1, $2, $3) returning *`
	        let params = [ user_id, quizNum, answer ];
        	client.query(sql, params, function(err, result){
			if(err) throw err
			else {
				res.send({"result" : "success"})
			}	
		})	
	} else {
		res.status(400).json({"Message" : "KeyError"})
	}
})

app.get('/result', function(req, res){
	let token = req.get('Authorization')
	let user;
        try{
                user = jwt.verify(token, secretKey)
        } catch(error) {
                res.status(400).json({"Message" : "Invalid_Token"})
        }

        let user_id = user.user_id

	let query = `select is_answer from user_answers where user_id=${user_id}`
	client.query(query, function(err, result){
		if(err) throw err
		else {
			let correct = 0;
			let wrong = 0;
			for (is_answer of result.rows) {
				if (is_answer.is_answer) {
					correct += 1
				} else {
					wrong += 1
				}
			}
			let return_answer = {
                                "status" : "결과확인응답",
				"correct" : correct,
				"wrong" : wrong
                        }
			res.send(return_answer)
		}
	})
})

app.get('/chart', function(req, res){
	let query = `
	select count(*) from users;
	select count(*) from users where language_id=1;
	select count(*) from users where language_id=2;
	select count(*) from users where language_id=3;
	select count(*) from users where language_id=4;
	select count(*) from users where language_id=5;
	select count(*) from users where language_id=6;
	select count(*) from users where language_id=7;
	select count(*) from users where language_id=8;
        select count(*) from users where device_type='PC';
        select count(*) from users where device_type='Mobile';
	`

	client.query(query, function(err, result){
		if(err){
			console.log(err)
			res.send({"message" : err})
		} else {
			let return_answer = {
				"result" : "success"
			}
			return_answer.user = {
				"total" : result[0].rows[0].count,
				"ko" : result[1].rows[0].count,
				"en" : result[2].rows[0].count,
				"ru" : result[3].rows[0].count,
				"th" : result[4].rows[0].count,
				"tu" : result[5].rows[0].count,
				"pt" : result[6].rows[0].count,
				"zh" : result[7].rows[0].count,
				"ja" : result[8].rows[0].count,
				"PC" : result[9].rows[0].count,
				"Mobile" : result[10].rows[0].count
			}
			query = `
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=1 and is_answer=true;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=1 and is_answer=false;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=1 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=2 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=2 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=2 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=3 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=3 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=3 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=4 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=4 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=4 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=5 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=5 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=5 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=6 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=6 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=6 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=7 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=7 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=7 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=8 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=8 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=8 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=9 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=9 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=9 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=10 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=10 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=10 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=11 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=11 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=11 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=12 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=12 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=12 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=13 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=13 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=13 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=14 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=14 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=14 and is_answer=null;
			select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=15 and is_answer=true;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=15 and is_answer=false;
                        select count(*) from user_answers inner join quizes on quiz_id = quizes.id where quiz_seq=15 and is_answer=null;
			`
			client.query(query, function(err, result){
				if(err){
					console.log(err)
					res.send({'m':err})
				} else {
					for (let i=0; i < 15; i++){
						return_answer[i+1] = {
							"정답" : result[i*3+0].rows[0].count,
							"오답" : result[i*3+1].rows[0].count,
							"미참여" : result[i*3+2].rows[0].count
						}

					
					}
					res.send(return_answer)
				}
			})
		}
	})
})
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3000});

wss.on("connection", function(ws) {
        console.log('Websocket 연결 성공')
  ws.on("message", function(message) {
	wss.clients.forEach(function each(client) {
	client.send(message);
		console.log(message)
	})
  });
});
