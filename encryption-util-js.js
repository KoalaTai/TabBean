const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const tagPosition = saltLength + ivLength;
const encryptedPosition = tagPosition + tagLength;

function getKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
}

exports.encrypt = (text, password) => {
  const iv = crypto.randomBytes(ivLength);
  const salt = crypto.randomBytes(saltLength);

  const key = getKey(password, salt);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
};

exports.decrypt = (encryptedText, password) => {
  const stringValue = Buffer.from(encryptedText, 'hex');

  const salt = stringValue.slice(0, saltLength);
  const iv = stringValue.slice(saltLength, tagPosition);
  const tag = stringValue.slice(tagPosition, encryptedPosition);
  const encrypted = stringValue.slice(encryptedPosition);

  const key = getKey(password, salt);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
};
