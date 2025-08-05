import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ActiveUserData, TokenPayload } from '../interfaces';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_SECRET') as string,
    });
  }

  validate(payload: TokenPayload): ActiveUserData {
    return payload;
  }
}
