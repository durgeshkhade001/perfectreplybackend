const Chat = require("../models/chat");

const create_new_chat = (req, res) => {
  const chat = new Chat(req.body);

  chat
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  create_new_chat,
};
