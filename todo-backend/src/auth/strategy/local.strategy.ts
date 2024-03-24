import * as bcrypt from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';
import { User } from '../../user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User Not Found : ' + email);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    return user;
  }
}
