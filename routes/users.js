var express = require('express');
var router = express.Router();
const models = require('../models')
const { Op } = require("sequelize")
const path = require("path")


router.get('/:id', async function(req, res, next) {
  try{
  const id = req.params.id
  const users = await models.User.findByPk(id);
  if(! users) {
    return res.status(404).json({message: 'user not found'})
  }
  res.json(users )
}catch(err){
  console.log('ini error',err)
  res.status(500).json(err)
}
});

router.get('/', async function (req, res, next) {
  try {
    const { page = 1, limit = 10, keyword = "", sort = "ASC" } = req.query
    const { count, rows } = await models.User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { phone: { [Op.iLike]: `%${keyword}%` } }
        ]
      },
      order: [["name", sort]],
      limit,
      offset: (page - 1) * limit
    });
    const pages = Math.ceil(count / limit)
    res.status(200).json({
      phonebooks: rows,
      page: Number(page),
      limit: Number(limit),
      pages: Number(pages),
      total: count
    })
  } catch (err) {
    console.log('ini erorr ', err)
    res.status(500).json({ err })
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
