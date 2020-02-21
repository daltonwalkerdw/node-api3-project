const express = require('express');

const userDb = require("./userDb")
const post = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  res.status(201).json(req.newUser)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postData = { ...req.body, user_id: req.params.id};

  post.insert(postData)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    res.status(500).json({
      message: "something went wrong"
    })
  })
});

router.get('/', (req, res) => {
  userDb.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
     next(error)
   
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.user.id)
  .then(posts => {
    if(!posts){
      res.status(404).json({
        message: "no post found"
      })
    } else {
      res.status(201).json(posts)
    }
    
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      message: "something went wrong"
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.params.id)
  .then(deleted => {
     res.status(201).json({
       message: "user was deleted"
     })
     
  })
  .catch(error => res.json({
       message: "something went wrong"
     }))
});

router.put('/:id', validateUserId, (req, res) => {
  

  if (!req.body) {
    res.status(400).json({
      message: "please provide a name"
    })
  }

  userDb.update(req.params.id, req.body)

  
  
  .then(user => {
    console.log(req.user)
    console.log(user)
    if(user){
      res.status(200).json(user)
    } else {
      res.status(404).json({
        message: "this user could not be found"
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      message: "something went wrong"
    })
  })
});

//custom middleware

function validateUserId(req, res, next) {
    userDb.getById(req.params.id)
    .then(user => {
      if(user){
        req.user = user

        next()
      } else {
        res.status(404).json({
          message: "user not found"
        })
      }
    })
    .catch(error => next(error))
}

function validateUser(req, res, next) {
  return(req, res, next) => {
 userDb.insert(req.body)
  .then(newUser => {
    if(!newUser){
       res.status(400).json({
         message: "missing user data"
       })
    } else {
      req.newUser = newUser

      next()
    }
  })
  .catch(error => next(error))
  }
 
}

function validatePost(req, res, next) {
    console.log(req.body)
     if(!req.body || req.body.text === ""){
       res.status(400).json({
         message: "missing text"
       })
     } else {
       next()
     }
}

module.exports = router;
