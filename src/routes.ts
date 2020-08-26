import express from 'express';

import UsersController from './app/controllers/UsersController';
import SessionsController from './app/controllers/SessionsController';
import ClassesController from './app/controllers/ClassesController';
import ConnectionsController from './app/controllers/ConnectionsController';

import endureAuthenticated from './app/middlewares/ensureAuthenticated';

const routes = express.Router();
const usersController = new UsersController();
const sessionsController = new SessionsController();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

// Create User
routes.post('/users', usersController.create);

// Create Session
routes.post('/sessions', sessionsController.create);

routes.use(endureAuthenticated);

routes.get('/classes', classesController.index);
routes.post('/classes', classesController.create);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;
