import { Request, Response } from 'express';
import ShowUserService from '../services/ShowUserService';
import UpdateProfileService from '../services/UpdateProfileService';

export default class ProfileUserController {
  public async show(request: Request, response: Response): Promise<Response> {
    const id = request.user.id;

    const showUser = new ShowUserService();

    const user = await showUser.execute({ id });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateProfile = new UpdateProfileService();

    const user = await updateProfile.execute({
      id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(user);
  }
}
