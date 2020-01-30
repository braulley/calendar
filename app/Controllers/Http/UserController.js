'use strict'

const User = use('App/Models/User')

class UserController {

  async store({ request, response }) {

    const data = request.all()
    console.log('data', data)
    const user = await User.create(data)

    return user

  }


}

module.exports = UserController
