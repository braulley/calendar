'use strict'


const Event = use('App/Models/Event')
const Mail = use('Mail')

const Database = use('Database')


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with events
 */
class EventController {

  async index ({ request, response, view }) {
  }

  async store ({ request, response, auth }) {

    try {

      const user = await auth.getUser()
      const userId = user.id

      const { title, date_event, localization } = request.only(['title', 'date_event', 'localization'])
      let data = {
        title: title,
        date_event: date_event,
        localization: localization,
        user_id: userId
      }

      const trx =  await Database.beginTransaction()

      const event = await Event.create(data, trx)
      await trx.commit()

      return event

    } catch (err) {
      return response.status(err.status).json(err.message)
    }
  }

  async getByDate({ params, request, response }){

    try {
      const date = request.input('date')
      const findByDate = await Event
        .query()
        .where('date_event', '>', date)
        .fetch()
      return findByDate

    } catch (err) {
      return response.status(err.status).json(err.message)
    }
  }

  async sharedEvent({ request, response , auth}){


    try {
      const { eventId, email } = request.only(['eventId', 'email'])

      const user = await auth.getUser()
      const userId = user.id

      console.log(eventId, email)


      const event = await Event.findByOrFail('id', eventId)


      if(!event){
        return response.status(400).json({'message':'Não há correspondência entre esse evento e o usuário, esse evento pertence a esse usuário?'})
      }

      await Mail.send(
        ['emails.new_event'],
        { title: event.title, localization: event.localization   },
        message => {
          message
            .to(email)
            .from(email,'Rocketseat')
            .subject('Novo Evento')
        }
      )
      return response.json({'message': 'Success'})
    } catch (err) {
      console.log(err)
      return response.status(err.status).json({'message':err.message})
    }

  }

  async destroy ({ params, request, response }) {

    try {

      const eventId = request.input('id')

      const event =  await Event.find(eventId)

      if(!event){
        return response.status(401).json({'message': 'Evento não encontrado!'})
      }

      const user = await auth.getUser()
      const userId = user.id

      if(userId !== event.user_id){
        return response.status(401).json({'message': 'Usuário não autorizado a deletar o Evento!'})
      }

      await event.delete()

      return response.json({'message': 'Evento deletado com sucesso'})

    } catch (err) {

    }
  }
}

module.exports = EventController
