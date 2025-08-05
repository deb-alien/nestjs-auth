# 📬 NestJS Email Verification with Redis & Docker

A full-featured NestJS authentication system with email-based OTP verification using Redis, Resend, and PostgreSQL. Includes endpoints for signup, OTP verification, login, logout, forgot password, and reset password.

## 🚀 Features

- Signup with email and password
- Email OTP verification (Redis-backed, 30 min expiry)
- Resend OPT for verification (rate limiting 5 request per 1 hour)
- Login & Logout (with HTTP-only cookies)
- Forgot and Reset password
- Dockerized setup with PostgreSQL and Redis
- Email sending via Resend

## 🛠️ Tech Stack

- NestJS (v11)
- TypeORM + PostgreSQL
- Redis (via ioredis)
- Resend for transactional emails
- Docker & Docker Compose

## 📦 Setup

### 1. Clone the repo

```bash
git https://github.com/deb-alien/nestjs-auth.git
cd nestjs-auth
```

### 2. Add .env

Create a `.env` file in the root directory:

```env
# App
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nest_auth
AUTO_LOAD=true
SYNCHRONIZE=true

# Token secrets and ttl
ACCESS_SECRET="d699139553e1f556886f04fe4e5c26e037cce4e5f1cdae672abb682640713737e42a27992ef6a481030795f2b9f1ab408c938a849d54d5432a1e951e0e17ac91"
ACCESS_TTL=86400000

REFRESH_SECRET="441d0ea34a65a3665ac3272a2e583da00b2a98ef873d2e014f183757f868d696f89c1934565d94512c35dc7ad86e90d1f070e34255303cf006baad42eb72ee68"
REFRESH_TTL=604800000

# Redis
REDIS_URL=redis://localhost:6379

# Resend Email
# Add the api key or the mail service won't work
RESEND_API_KEY=your_resend_api_key
```

## 3. Install the packages

```bash
pnpm install --frozen-lockfile
```

## 4. Use the API

Use an API tool like Postman or Thunder Client to call the following routes:

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | /auth/sign-up         | Register new user |
| POST   | /auth/verify-email    | Verify OTP        |
| PATCH  | /auth/resend-otp      | Resend OTP        |
| GET    | /auth/refresh         | Refresh Token     |
| POST   | /auth/sign-in         | Login             |
| POST   | /auth/sign-out        | Logout            |
| POST   | /auth/forgot-password | Send reset OTP    |
| PATCH  | /auth/reset-password  | Reset password    |

## Run the app

```bash
# Start app + services
pnpm app:run
```

this will start the app and the docker services:
- visit http://localhost:3000/api for Swagger doc
- You can also see the **http** folder to test out the api



## 📂 Project Structure

```
http/
src/
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   └── auth.module.ts
├── users/
├── redis/
├── mail/
├── common/
├── main.ts
└── app.module.ts
```

## 📧 Email Templates

Email templates are HTML-based and sent via Resend. Includes:

- Welcome email
- OTP verification
- Password reset OTP
- Password reset successful

## 🛡️ Security

- Passwords hashed with bcrypt
- Refesh Tokens hashed and stored securely in Redis with expiry
- OTPs stored securely in Redis with expiry






