const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const db = require('./db');
const todo = require('./router');

const app = express();
const port = process.env.PORT || 3003;
const REDIS_URL = process.env.REDIS_URL || 'redis://:@localhost:6379';
const redisOptions = url.parse(REDIS_URL);

app.use(session({
  store: new RedisStore({
    host: redisOptions.hostname,
    port: redisOptions.port,
    pass: redisOptions.auth.split(':')[1],
  }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(__dirname + '/asset'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');
app.set('views', './views');


db.sync().then(() => {
	app.listen(port);
}).catch((err) => {
	console.log(err)
});

/*<================================= Main Router ==========================>*/
app.get('/', (req, res) => {

	const {username} = req.session;

	if (!username) {
		res.redirect('/login');
	} else {
		res.redirect('/todo');
	}
});

/*<================================== Login ===============================>*/

function isLogon(req) {
	if (req.session.username) 
		return true;
	return false;
}

app.get('/login', (req, res) => {

	if (isLogon(req)) {
		res.redirect('/');
	} else {
	  	res.render('login');
	}
});

app.post('/login', (req, res) => {

	console.log(req.body)

	const {usr, pwd} = req.body;

	if (usr !== '1660765' || pwd !== 'kocopass') {
		res.render('login');
	} else {
		req.session.username = usr;
		res.redirect('/');		
	}
});

/*<================================== Todo ===============================>*/

app.use('/todo', todo);

/*<================================== Logout ===============================>*/
app.get('/logout', (req, res) => {
	delete req.session.username;
	res.redirect('/');
});
