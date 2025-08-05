import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Tokens } from '../interfaces';
import { TokenManager } from './token-manager.service';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly userService: UserService,
    private readonly tokenManager: TokenManager,
  ) {}

  public async refreshToken(id: string, token: string): Promise<Tokens> {
    const isTokenValid = await this.tokenManager.validateToken(id, token);
    if (!isTokenValid) throw new ForbiddenException('Invalid or Expired Token');

    const user = await this.userService.findById(id);
    if (!user) throw new UnauthorizedException('User Not Found');

    const { access_token, refresh_token } =
      await this.tokenManager.generateTokens({ sub: user.id });

    await this.tokenManager.storeToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }
}
