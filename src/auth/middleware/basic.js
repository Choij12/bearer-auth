'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');
const bcrypt = require('bcrypt');

async function basicAuth(request, response, next){
  
  if (!request.headers.authorization) {
    response.status(403).send('no authorization headers');
  }

  try {

    let authString = request.headers.authorization;

    console.log(authString, '<-- authString --<<')

    let encodedUserPass = authString.split(' ')[1];

    console.log(encodedUserPass, '<-- encodedUserPass --<<')

    let decodedUserPass = base64.decode(encodedUserPass);

    console.log(decodedUserPass, '<-- decodedUserPass --<<')

    let [username, pass] = decodedUserPass.split(':');

    let userQuery = await users.findOne({where: { username }});

    console.log(userQuery, '<-- USER QUERY --<<')

    let password = userQuery.password;

    console.log(pass, '<-- PASS | PASSWORD -->', password)

    let isValidPassword = await bcrypt.compare(pass, password);
   
    if (isValidPassword) {
   
      response.send(userQuery);
   
    } else {

      response.status(403).send('password doesn\'t match');

    }
   
  } catch (error) {

      response.status(401).send('unauthenticated request');

  }

}

module.exports = {basicAuth};