/* eslint-env jest */
const fs = require('fs').promises;

const AasaamAES = require('.');

describe('AasaamAES', () => {
  it('global mode', async () => {
    expect(AasaamAES.generateKey()).toBeTruthy();
  });
  it('global mode', async () => {
    const test = JSON.parse(
      await fs.readFile(`${__dirname}/test.json`, { encoding: 'utf-8' }),
    );
    const aes = new AasaamAES(test.key);
    const decryptedTest = aes.decrypt(test.encrypted);
    const decryptedTestTTL = aes.decryptTTL(test.encryptedTTL);
    expect(decryptedTest).toEqual(test.message);
    expect(decryptedTestTTL).toEqual(test.message);
    const encryptedTTLMessage = aes.encryptTTL(test.message, 1);
    const decrypted1 = aes.decryptTTL(encryptedTTLMessage);
    expect(decrypted1).toEqual(test.message);
    await new Promise((r) => setTimeout(r, 2000));
    expect(aes.decryptTTL(encryptedTTLMessage)).toEqual('');
    expect(aes.decrypt('aaaa')).toEqual('');
    expect(aes.decryptTTL('aaaa')).toEqual('');
    expect(aes.decryptTTL(test.encrypted)).toEqual('');
  });
});
