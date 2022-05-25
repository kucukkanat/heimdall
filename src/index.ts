import { secretbox, box, randomBytes } from "tweetnacl";
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from "tweetnacl-util";

type Base64String = string;

const newNonce = () => randomBytes(nonceLength);
const { nonceLength, keyLength } = secretbox;
class Wallet {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
  constructor() {
    const keypair = box.keyPair();
    const { publicKey, secretKey } = keypair;
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    console.log(
      `My publickey length is : ${this.publicKey.length}`,
      secretbox.keyLength
    );
  }
  export() {
    return {
      publicKey: encodeBase64(this.publicKey),
      secretKey: encodeBase64(this.secretKey),
    };
  }
  encrypt(message: string, publicKey: Base64String) {
    const nonce = newNonce();
    const publicKeyUint8 = decodeBase64(publicKey);
    // Any string to uint8array
    // const messageUint8 = decodeUTF8(message);
    const messageUint8 = new TextEncoder().encode(message);
    const encrypted = box(messageUint8, nonce, publicKeyUint8, this.secretKey);

    // Full message is a Uint8Array of NONCE + MYPUBLIC + ENCRYPTED_MSG
    const fullMessage = new Uint8Array([
      ...nonce,
      ...this.publicKey,
      ...encrypted,
    ]);

    return encodeBase64(fullMessage);
  }
  decrypt(message: Base64String) {
    const encryptedFullMessageUint8 = decodeBase64(message);
    // Extract nonce
    const nonce = encryptedFullMessageUint8.slice(0, nonceLength);
    // Extract Encryptors Public Key
    const theirPublicKey = encryptedFullMessageUint8.slice(
      nonceLength,
      nonceLength + keyLength
    );
    // Extract encrypted message
    const encryptedMessage = encryptedFullMessageUint8.slice(
      nonceLength + keyLength
    );
    const decryptedFullMessage = box.open(
      encryptedMessage,
      nonce,
      theirPublicKey,
      this.secretKey
    );
    return encodeUTF8(decryptedFullMessage);
  }
}

const wallet1 = new Wallet();
const wallet2 = new Wallet();

const msg = wallet1.encrypt("Hello World", wallet2.export().publicKey);
const decrypted = wallet2.decrypt(msg);
console.log({ decrypted, msg });
