import { hash, compare } from 'bcryptjs';

export class BcryptPasswordHasher {
  constructor(private readonly rounds: number = 12) {}

  async hash(plain: string): Promise<string> {
    return hash(plain, this.rounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}

export class CryptoTokenGenerator {
  generate(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
