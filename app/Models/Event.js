'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {

  User() {
    this.belongsTo('App/Models/User')
  }
}

module.exports = Event
