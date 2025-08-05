import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from '../../user/user.service';
import { SignInDto } from '../dto/sign-in.dto';
import { Tokens } from '../interfaces';
import { TokenManager } from './token-manager.service';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly userService: UserService,
    private readonly tokenManager: TokenManager,
  ) {}

  public async signIn(dto: SignInDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const passwordMatch = await compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid Credentials');

    const { access_token, refresh_token } =
      await this.tokenManager.generateTokens({ sub: user.id });

    await this.tokenManager.storeToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }
}
