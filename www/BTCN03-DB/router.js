const Router = require('express-promise-router');
const router = Router();
const Sequelize = require('sequelize');
const db = require('./db');

const Todo = db.define('todo', {
  name: Sequelize.STRING,
  time: Sequelize.STRING,
  state: Sequelize.BOOLEAN,
});  

/*<================================= Todo ========================================>*/

function isLogon(req) {
  if (req.session.username) 
    return true;
  return false;
}

router.get('/', async (req, res) => {

  if (!isLogon(req)) {

      res.render('login');
  } else {
      const todos = await Todo.findAll({order: [['id', 'ASC']]});
      res.render('todo', {todos});
  }
});


router.put('/', async (req, res) => {

  if (!isLogon(req)) {

      res.render('login');

  } else {

      const id = req.body.id;
      const todo = await Todo.findOne({ where: {id: id} });

      if (todo) {
        todo.state = (todo.state == true) ? false : true;
      }
      await todo.save();

      res.status(200);
  }
});

router.post('/', async (req, res) => {

  if (!isLogon(req)) {

      res.render('login');

  } else {

    const todo = await Todo.create({ 
      // id: id, 
      name: req.body.name,
      time: req.body.time,
      state: false
    });
    res.json(todo);
  }

});

module.exports = router;
