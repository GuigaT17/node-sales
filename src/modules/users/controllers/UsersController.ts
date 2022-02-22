import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUsersService from '../services/ListUsersService';
import { instanceToInstance } from 'class-transformer';

export default class UserController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService();

    const users = await listUsers.execute();

    return response.json(instanceToInstance(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}
