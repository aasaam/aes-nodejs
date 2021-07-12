/* eslint-env jest */
const fs = require('fs').promises;

const AasaamAES = require('.');

describe('AasaamAES', () => {
  it('generate key', async () => {
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

  it('owner data', async () => {
    const test = JSON.parse(
      await fs.readFile(`${__dirname}/test.json`, { encoding: 'utf-8' }),
    );

    const mustSecureMessage = 'very secret message';

    const clientDataSender = [
      '1.1.1.1',
      'user-agent',
    ];

    const clientDataSenderKey = AasaamAES.generateHashKey(test.key, clientDataSender);
    const aesEncryption = new AasaamAES(clientDataSenderKey);
    const networkData = aesEncryption.encrypt(mustSecureMessage);

    const clientDataReceiverKey = AasaamAES.generateHashKey(test.key, clientDataSender);
    const aesDecryption = new AasaamAES(clientDataReceiverKey);
    const sameData = aesDecryption.decrypt(networkData);

    const sameDataGlobal = aesDecryption.decrypt(test.networkData);

    expect(sameData).toEqual(mustSecureMessage);
    expect(sameDataGlobal).toEqual(sameDataGlobal);
  });
});
