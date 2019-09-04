const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session) // remember to pass the session 


const authRouter = require('../auth/auth-router.js')
const usersRouter = require('../users/users-router.js')
const knexConnection = require('../database/db-config.js')

const server = express();


// SESSION CONFIGURATION
const sessionOptions = {
  name: 'fiftyfirstdates',
  secret: process.env.COOKIE_SECRET || 'keep it secret',// for encryption
  cookie: {
    secure: process.env.COOKIE_SECURE || false, // in production should be true, false for development
    maxAge: 1000 * 60 * 60 * 24, // in total a day // how long is the session good for, in milliseconds
    httpOnly: true, // client JS has no access to the cookie
  },
  resave: false,
  saveUninitialized: true, // for GDPR compliance 
  store: new KnexSessionStore({ // store to save sessions in database, so when server is restarted it doesn't wipe out
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 30, //how long before we clear out expired sessions
  })
}


server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session(sessionOptions))

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)


// TO SEE SESSION
server.get('/', (req, res) => {
  res.json({ api: 'up', session: req.session });
});


module.exports = server