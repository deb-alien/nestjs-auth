import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ActiveUserData, TokenPayload } from '../interfaces';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REFRESH_SECRET') as string,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: TokenPayload): ActiveUserData {
    const refresh_token = request.headers?.authorization?.split(' ')[1];
    return { ...payload, refresh_token };
  }
}
