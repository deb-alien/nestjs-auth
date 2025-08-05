export interface TokenPayload {
  sub: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface ActiveUserData {
  sub: string;
  refresh_token?: string;
}
