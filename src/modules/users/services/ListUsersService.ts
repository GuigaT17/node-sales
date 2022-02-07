import { getCustomRepository } from 'typeorm';
import User from '../entities/User';
import { UserRepository } from '../repositories/UsersRepository';

class ListUsersService {
  public async execute(): Promise<User[]> {
    const userRepository = getCustomRepository(UserRepository);

    const users = userRepository.find();

    return users;
  }
}

export default ListUsersService;
