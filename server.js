const express = require('express');
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")

const server = express();

server.use(express.json());


server.use(logger)
server.use((err, req, res, next) => {

  console.log(err);
      res.status(500).json({
        message: 'something went wrong',
      });
})
server.use("/api/users", userRouter)
server.use("/api/post", postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next){
    const ip = req.ip
    const method = req.method
    const url = req.url

    const agent = req.get("user-agent")
    console.log(`${ip} ${method} ${url} ${agent} `)

    next()
}

module.exports = server;
