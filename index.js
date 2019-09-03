const express = require('express');
const server = express()
const bcrypt = require('bcryptjs')


const Users = require('./users/users-model')
const restricted = require('./auth/restricted-middleware')
server.use(express.json())

server.get('/', (req, res) => {
  res.send('It\'s working')
})


// REGISTER - HASHING PASSWORD HERE
server.post('/api/register', (req, res) => {
  let user = req.body

  // HASH PASSWORD
  const hash = bcrypt.hashSync(user.password)
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
server.post('/api/login', (req, res) => {
   let { username, password } = req.body

   Users.findBy({ username })
   .first()
   .then(user => {

      // CHECKS IF PASSWORD IS MATCHING PASSWORD IN DB SAVED WHEN REGISTERED
      if(user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}`})
      } else {
        res.status(401).json({ message: 'Invalid credentials'})
      }
   })
   .catch(error => {
     res.status(500).json(error)
   })
})





const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));