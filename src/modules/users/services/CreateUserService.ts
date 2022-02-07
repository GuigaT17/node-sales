import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('There is already a user with this email');
    }

    const hashedPass = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPass,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
