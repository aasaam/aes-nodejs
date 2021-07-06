declare class AasaamAES {
  /**
   * Binary encryption key
   *
   * @var {Buffer}
   */
  private key: Buffer;

  /**
   * Create instance
   *
   * @param  {string} key Base64 encoded random bytes with length 32
   */
  constructor(key: string);

  /**
   * Generate encryption key
   *
   * @return {string} Base64 encoded random bytes with length 32
   */
  public static generateKey(): string;

  /**
   * Encrypt message with time to live
   *
   * @param  {string} message Message to be encrypted
   * @param  {number} ttl number of time to live in second
   * @return {string} Encrypted message with time to live
   */
  public encryptTTL(message: string, ttl: number): string;

  /**
   * Decrypted message that contain time to live
   *
   * @param  {string} encryptedTTLMessage Encrypted message with time to live
   * @return {string} Original message or empty string on failure
   */
  public decryptTTL(encryptedTTLMessage: string): string;

  /**
   * Encrypt message
   *
   * @param  {string} message Message to be encrypted
   * @return {string} Encrypted message
   */
  public encrypt(message: string): string;

  /**
   * Decrypt message
   *
   * @param  {string} encryptedMessage Encrypted message
   * @return {string} Original message or empty string on failure
   */
  public decrypt(encryptedMessage: string): string;
}

export default AasaamAES;
