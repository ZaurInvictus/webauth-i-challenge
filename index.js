const express = require('express');
const server = express()
const bcrypt = require('bcryptjs')

const db = require('./database/db-config')
const Users = require('./users/users-model')
const restricted = require('./auth/restricted-middleware')


server.get('/', (req, res) => {
  res.send('It\'s working')
})


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));