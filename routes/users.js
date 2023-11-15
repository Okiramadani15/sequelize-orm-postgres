var express = require('express');
var router = express.Router();
const models = require('../models')

router.get('/', async function(req, res, next) {
  try{
  const users = await models.User.findAll();
  res.json(users )
}catch(err){
  console.log('ini error',err)
  res.json(err)
}
});

router.post('/', async function(req, res, next) {
  try{
  const {name,phone} = req.body
  const user = await models.User.create({name,phone});
  res.json(user )
}catch(err){
  console.log('ini error',err)
  res.json(err)
}
});

router.put('/:id', async function(req, res, next) {
  try{
  const {name,phone} = req.body
  const user = await models.User.update({name,phone},{
    where: {
      id: req.params.id
    },
    returning:true,
    plain:true
  });
  res.json(user[1])
}catch(err){
  console.log('ini error',err)
  res.json(err)
}
});

router.put('/:id/avatar', async function(req, res, next) {
  try{
  const {name,phone,avatar} = req.body
  const user = await models.User.update({name,phone,avatar},{
    where: {
      id: req.params.id
    },
    returning:true,
    plain:true
  });
  res.json(user[1])
}catch(err){
  console.log('ini error',err)
  res.json(err)
}
});

router.delete('/:id', async function(req, res, next) {
  try{
  const {name,phone,avatar} = req.body
  const user = await models.User.destroy({
    where: {
      id: req.params.id
    }
  });
  res.json(user)
}catch(err){
  console.log('ini error',err)
  res.json(err)
}
});




module.exports = router;
