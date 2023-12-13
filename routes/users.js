var express = require("express");
var router = express.Router();
const models = require("../models");
const { Op } = require("sequelize");
const path = require("path");

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const users = await models.User.findByPk(id);
    if (!users) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(users);
  } catch (err) {
    console.log("ini error", err);
    res.status(500).json(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const { page = 1, limit = 10, keyword = "", sort = "ASC" } = req.query;
    const { count, rows } = await models.User.findAndCountAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${keyword}%` } }, { phone: { [Op.iLike]: `%${keyword}%` } }],
      },
      order: [["name", sort]],
      limit,
      offset: (page - 1) * limit,
    });
    const pages = Math.ceil(count / limit);
    res.status(200).json({
      phonebooks: rows,
      page: Number(page),
      limit: Number(limit),
      pages: Number(pages),
      total: count,
    });
  } catch (err) {
    console.log("ini erorr ", err);
    res.status(500).json({ err });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { name, phone } = req.body;
    const user = await models.User.create({ name, phone });
    res.json(user);
  } catch (err) {
    console.log("ini error", err);
    res.json(err);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const { name, phone } = req.body;
    const user = await models.User.update(
      { name, phone },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
        plain: true,
      }
    );
    res.json(user[1]);
  } catch (err) {
    console.log("ini error", err);
    res.json(err);
  }
});

router.put("/:id/avatar", async function (req, res, next) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.avatar;
  uploadPath = __dirname + "/../public/images/" + sampleFile.name;
  console.log(uploadPath);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, async function (err) {
    if (err) return res.status(500).send(err);

    try {
      const user = await models.User.update(
        { avatar : sampleFile.name },
        {
          where: {
            id: req.params.id,
          },
          returning: true,
          plain: true,
        }
      );
      res.json(user[1]);
    } catch (err) {
      console.log("ini error", err);
      res.json(err);
    }
  });
});

router.delete("/:id", async function (req, res, next) {
  try {
    const deleteUser = await models.User.findOne({
      where: {
        id: req.params.id,
      },
    });
    const user = await models.User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(deleteUser);
  } catch (err) {
    console.log("ini error", err);
    res.json(err);
  }
});

module.exports = router;
