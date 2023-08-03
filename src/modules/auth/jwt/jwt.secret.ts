import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtSecretService {
  private static secret: string;

  // 生成 jwt 密钥
  static generateSecretKey() {
    const env = process.env.NODE_ENV;
    if (env === 'development') {
      JwtSecretService.secret =
        'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.';
      return JwtSecretService.secret;
    }

    if (!JwtSecretService.secret) {
      JwtSecretService.secret = randomBytes(32).toString('hex');
    }
    return JwtSecretService.secret;
  }

  getSecret() {
    return JwtSecretService.secret || JwtSecretService.generateSecretKey();
  }
}
