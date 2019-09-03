const db = require('../database/db-config')


module.exports = {
  add,
  findById
}

function add(user) {
  return db('users')
  .insert(user, 'id')
  .then(ids => {
    const [id] = ids
    return findById(id)
  })
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}
