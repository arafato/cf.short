
export class HashUrlShortener {
  private static readonly CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  // private simpleHash(str: string): number {
  //   let hash = 0;
  //   for (let i = 0; i < str.length; i++) {
  //     const char = str.charCodeAt(i);
  //     hash = ((hash << 5) - hash) + char;
  //     hash = hash & hash; // Convert to 32-bit integer
  //   }
  //   return Math.abs(hash);
  // }

  private toBase62(num: number): string {
    if (num === 0) return HashUrlShortener.CHARS[0];
    let result = '';
    while (num > 0) {
      result = HashUrlShortener.CHARS[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  private randomChars(length: number = 4): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.';
    let result = '';
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      result += chars[idx];
    }
    return result;
  }

  generateAlias(counterValue: number): string {
    const base62 = this.toBase62(counterValue);
    const randomPart = this.randomChars(4);
    const alias = base62 + randomPart;
    return alias
  }
}
