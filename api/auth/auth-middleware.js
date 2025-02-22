const Users = require("../users/users-model")

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  console.log("beep beep boop")
  next()
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try{
  const users = await Users.findBy({ username: req.body.username })
  // ^^ findBy returns an arary not a single user  
  if(!users.length){
      next()
    } else {
      next({
        status: 422,
        message: "Username taken"
       })
    }
  } catch(err){
    next()
  }
}

async function checkUsernameExists(req, res, next) {
  try{
    const users = await Users.findBy({ username: req.body.username })
    if(users.length){
      req.user = users[0]
      next()
    } else {
      next({ status: 401, message: "Invalid credentials" })
    }
  } catch(err){
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body
  if(!password || password.trim().length < 3){
    next({ message: "Password must be longer than 3 chars", status: 422 })
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists
}