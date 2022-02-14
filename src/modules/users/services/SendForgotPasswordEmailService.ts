import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../typeorm/repositories/UsersRepository';
import { UsersTokenRepository } from '../typeorm/repositories/UsersTokenRepository';
import EtherealMail from '@config/mail/EtherealMail';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);
    const userTokenRepository = getCustomRepository(UsersTokenRepository);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const token = await userTokenRepository.generate(user.id);

    await EtherealMail.sendMail({
      to: email,
      body: 'Solicitaçao de senha, use o token: ' + token?.token,
    });
  }
}

export default SendForgotPasswordEmailService;
