
export class HashUrlShortener {
  private static readonly CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private usedAliases = new Set<string>();

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private toBase62(num: number, length: number = 6): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result = HashUrlShortener.CHARS[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  generateAlias(url: string): string {
    let hash = this.simpleHash(url);
    let alias = this.toBase62(hash, 6);
    
    // Handle collisions by incrementing hash
    while (this.usedAliases.has(alias)) {
      hash++;
      alias = this.toBase62(hash, 6);
    }
    
    this.usedAliases.add(alias);
    return alias;
  }
}
