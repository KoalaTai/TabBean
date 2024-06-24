class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyUsages = ['encrypt', 'decrypt'];
  }

  async generateKey() {
    return await window.crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: 256,
      },
      true,
      this.keyUsages
    );
  }

  async exportKey(key) {
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exportedKey));
  }

  async importKey(keyData) {
    const keyBuffer = new Uint8Array(keyData).buffer;
    return await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      this.algorithm,
      true,
      this.keyUsages
    );
  }

  async encrypt(data, key) {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      key,
      encodedData
    );

    return {
      iv: Array.from(iv),
      encryptedData: Array.from(new Uint8Array(encryptedContent))
    };
  }

  async decrypt(encryptedData, key) {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: new Uint8Array(encryptedData.iv)
      },
      key,
      new Uint8Array(encryptedData.encryptedData)
    );

    const decryptedText = new TextDecoder().decode(decrypted);
    return JSON.parse(decryptedText);
  }
}

export default new EncryptionService();
