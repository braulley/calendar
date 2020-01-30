'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store')
Route.post('forgotAccount', 'ForgotAccountController.store')
Route.put('forgotAccount', 'ForgotAccountController.update')

Route.group(() => {

  Route.post('events', 'EventController.store')
  Route.get('events', 'EventController.getByDate')
  Route.post('sharedEvents','EventController.sharedEvent')

}).middleware(['auth'])
