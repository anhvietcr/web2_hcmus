const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3003;
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/asset'));
app.use(session({
	secret: '1660765',
	resave: true,
	saveUninitialized: true
}));

app.listen(port);


/*<================================= Global ==========================>*/
var todos = [];

/*<================================= Main Router ==========================>*/
app.get('/', (req, res) => {

	const {username} = req.session;

	if (!username) {
		res.redirect('/login');
	} else {
		todos = req.session.todos || [];

		res.render('todo', {todos});		
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

	const {usr, pwd} = req.body;

	if (usr !== '1660765' || pwd !== 'kocopass') {
		res.render('login');
	} else {
		req.session.username = usr;
		res.redirect('/');		
	}
});

/*<================================== Todo ===============================>*/

app.get('/todo', (req, res) => {
	res.render('todo', {todos});
});


app.put('/todo', (req, res) => {

	if (!isLogon(req)) {

	  	res.render('login');

	} else {
		const id = req.body.id;

		if (todos[id]) {
			todos[id].state = (todos[id].state == 'true') ? 'false' : 'true';
		}
		req.session.todos = todos;

		res.render('todo', {todos});
	}
});

app.post('/todo', (req, res) => {

	if (!isLogon(req)) {

	  	res.render('login');

	} else {

		var id = 0;
		if (todos.length <= 0) {
			id = 0;
		} else {
			id = todos[todos.length - 1].id + 1;
		}

		todos.push({
			id: id, 
			name: req.body.name,
			state: req.body.state,
			time: req.body.time
		});
		req.session.todos = todos;

		res.json({id: id});
	}

});

/*<================================== Logout ===============================>*/
app.get('/logout', (req, res) => {
	delete req.session.username;
	res.redirect('/');
});
