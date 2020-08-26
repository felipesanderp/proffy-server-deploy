import { Request, Response } from 'express';
import { hash } from 'bcryptjs';

import db from '../../database/connection';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
}

export default class ClassesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, lastname, email, password } = request.body;

    const trx = await db.transaction();

    const userExists = await trx('users').where('email', email);

    if (userExists.length > 0) {
      if (userExists) {
        const userEmail = userExists[0];

        if(userEmail.email === email) {
          return response.json({ message: 'User already exists!' });
        }
      }
    }

    const hashedPassword = await hash(password, 8);

    try {
      const inserrtedUsers = await trx('users').insert({
        name,
        lastname,
        email,
        password: hashedPassword,
      }).returning('*');

      const user = inserrtedUsers[0] as User;

      await trx.commit();

      return response.json({
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
    });

    } catch (err) {
      await trx.rollback();
  
      return response.status(400).json({
        error: 'Unexpected error while creating user'
      });
    }
  } 
}