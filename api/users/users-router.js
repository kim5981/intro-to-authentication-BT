const router = require("express").Router()
const { 
  restricted,
} = require("../auth/auth-middleware")

const User = require("./users-model")



  router.get("/", restricted, async (req, res, next) => {
    try{
      const users = await User.find()
      if(users){
      res.json(users)
      }else {
        next({ status: 401, message: "You shall not pass" })
      }
    } catch(err) {
      next()
    }
  })


module.exports = router