import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import db from '../../database/connection';
import authConfig from '../../config/auth';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  avatar: string;
  bio: string;
  whatsapp: string;
  password: string;
}

export default class ClassesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const trx = await db.transaction();

    const userExists = await trx('users').where('email', email);

    if (userExists.length > 0) {
      const user  = userExists[0] as User;

      const { id, name, lastname, email, avatar, bio, whatsapp } = user;

      const checkPassword = await compare(password, user.password);

      if (!checkPassword) {
        return response.json({ message: `Password dosen't match.` });
      }

      await trx.commit();

      const { secret, expiresIn } = authConfig.jwt

      return response.json({
        user: {
          id,
          name,
          lastname,
          email,
          avatar,
          bio,
          whatsapp,
        },
        token: sign({ id }, secret, {
          expiresIn,
        }),
      });
    } else {
      return response.json({ message: `User don't exists.` });
    }
  } 
}