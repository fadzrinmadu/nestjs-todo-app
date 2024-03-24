import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Constants } from 'src/utils/constants';

@EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, firstName, lastName, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = hashedPassword;
    user.role = Constants.ROLES.NORMAL_ROLE;

    return this.save(user);
  }
}
