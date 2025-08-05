import { Injectable } from '@nestjs/common';
import { TokenManager } from './token-manager.service';

@Injectable()
export class SignOutProvider {
  constructor(private readonly tokenManager: TokenManager) {}

  public async signOut(id: string): Promise<void> {
    await this.tokenManager.invalidateToken(id);
  }
}
