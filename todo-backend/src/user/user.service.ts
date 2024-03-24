import { Injectable } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }

  findUserById(id: number) {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
