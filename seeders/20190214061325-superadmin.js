'use strict';
const bcrypt  = require('bcryptjs');

function gensaltedhash(password) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}

let hashed_password = gensaltedhash("beacon5791");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('users', [{
      id: 1,
      name: "Admin",
      username: "admin",
      email: "admin@beaconstalk.com",
      password: hashed_password,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "BMS Admin",
      username: "bms",
      email: "admin@bookmyshow.com",
      password: hashed_password,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  }
};

