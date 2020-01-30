'use strict'

class User {
  get rules () {
    return {
      // validation
      username:'required|username|unique:users',
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

}

module.exports = User
