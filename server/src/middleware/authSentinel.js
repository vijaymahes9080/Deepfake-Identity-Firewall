import crypto from 'crypto';
export class AuthSentinel {
  generateSessionToken(sessionId) {
    return 'fw_tok_' + crypto.randomBytes(16).toString('hex');
  }
}
export const authSentinel = new AuthSentinel();