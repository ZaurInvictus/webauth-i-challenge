const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');


// REGISTER - HASHING PASSWORD HERE
// for endpoint beginning with /api/auth => /register
router.post('/register', (req, res) => {
  let user = req.body

  // HASH PASSWORD
  const hash = bcrypt.hashSync(user.password, 10) // 2 ^ n
  user.password = hash

  Users.add(user)
  .then(saved => {
    res.status(201).json(saved)
  })
  .catch(error => {
    res.status(500).json(error)
  })
})


// LOGIN - CHECKING HASH PASSWORD HERE
router.post('/login', (req, res) => {
   let { username, password } = req.body

   Users.findBy({ username })
   .first()
   .then(user => {
      // CHECKS IF PASSWORD IS MATCHING PASSWORD IN DB SAVED WHEN REGISTERED
      if(user && bcrypt.compareSync(password, user.password)) {
         //STORE DATA INSIDE SESSION IN SERVER BEFORE SENDING RESPONSE // TO SEE DATA MAKE GET CALL TO http://localhost:5000
         req.session.movie = '50 First Dates' // for test
         req.session.username = user.username // only on successful login
         req.session.loggedIn = true // to check in the middleware if user is logged in

        res.status(200).json({ message: `Welcome ${user.username}!`})
      } else {
        res.status(401).json({ message: 'Invalid credentials'})
      }
   })
   .catch(error => {
     res.status(500).json(error)
   })
})


// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    res.status(200).json({ bye: 'Zaur'})
  })
})



module.exports = router;