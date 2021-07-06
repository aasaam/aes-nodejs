const crypto = require('crypto');

class AasaamAES {
  /**
   * Create instance
   *
   * @param  {String} key Base64 encoded random bytes with length 32
   */
  constructor(key) {
    /**
     * Binary encryption key
     *
     * @private
     * @type {Buffer}
     */
    this.key = Buffer.from(key, 'base64');
  }

  /**
   * Generate encryption key
   *
   * @return {String} Base64 encoded random bytes with length 32
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('base64');
  }

  /**
   * Encrypt message with time to live
   *
   * @param  {String} message Message to be encrypted
   * @param  {Number} ttl Number of time to live in second
   * @return {String} Encrypted message with time to live
   */
  encryptTTL(message, ttl) {
    return this.encrypt(
      JSON.stringify({
        message,
        ttl: Math.round(Date.now() / 1000) + ttl,
      }),
    );
  }

  /**
   * Decrypted message that contain time to live
   *
   * @param  {String} encryptedTTLMessage Encrypted message with time to live
   * @return {String} Original message or empty string on failure
   */
  decryptTTL(encryptedTTLMessage) {
    try {
      const { message, ttl } = JSON.parse(this.decrypt(encryptedTTLMessage));
      if (ttl >= Math.round(Date.now() / 1000)) {
        return message;
      }
    } catch (e) {

      // nothing
    }

    return '';
  }

  /**
   * Encrypt message
   *
   * @param  {String} message Message to be encrypted
   * @return {String} Encrypted message
   */
  encrypt(message) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const enc = cipher.update(message);
    cipher.final();
    return Buffer.concat([iv, enc, cipher.getAuthTag()]).toString('base64');
  }

  /**
   * Decrypt message
   *
   * @param  {String} encryptedMessage Encrypted message
   * @return {String} Original message or empty string on failure
   */
  decrypt(encryptedMessage) {
    const packet = Buffer.from(encryptedMessage, 'base64');

    try {
      const iv = packet.slice(0, 12);
      const enc = packet.slice(12, packet.length - 16);
      const authTag = packet.slice(packet.length - 16);
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
      decipher.setAuthTag(authTag);
      const str = decipher.update(enc);
      decipher.final();
      return str.toString('utf8');
    } catch (e) {
      // nothing
    }
    return '';
  }
}

module.exports = AasaamAES;
