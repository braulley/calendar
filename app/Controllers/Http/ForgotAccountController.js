'use strict'

const User = use('App/Models/User')
const crypto = require('crypto')
const moment = require('moment')
const Hash = use('Hash')


class ForgotAccountController {

  async store({ request, response }){

    try {

      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      return response.json({'message':'Aguardando validação do token!'})
    } catch (err) {
      return response.status(err.status).json({'message': err.message})
    }
  }


  async update({ request, response }){

    try {

      const { token, username, password, newPassword, confirmPassword } =  request.all()


      const user = await User.findByOrFail('token', token)
      console.log('token', await User.findByOrFail('token', token))
      const tokenIsExpired = moment()
                              .subtract('2','days')
                              .isAfter(user.token_created_at)

      if(tokenIsExpired){
        return response.status(401)
                       .send({ error: { message: 'O token de recuperação está expirado' } })
      }

      const safePassword = await Hash.verify(password, user.password)

      if(!safePassword){
        return response.status(401)
                       .send({ error: { message: 'Senha inválida!' } })
      }

      if(newPassword !== confirmPassword){
        return response.status(401)
                       .send({ error: { message: 'Senhas novas não possuem correspondências!' } })
      }

      user.username = username
      user.password = newPassword
      user.token = null
      user.token_created_at = null

      await user.save()

      return response.json({ 'message': 'Recuperação de conta concluída com sucesso!' })

    } catch (err) {
      return response.status(401)
                     .send({ error: { message: err.message } })
    }
  }

}

module.exports = ForgotAccountController
