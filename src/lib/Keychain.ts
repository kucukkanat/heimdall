import { sign, box, randomBytes } from "tweetnacl";
import {
  encodeBase64 as Uint8ArrayToBase64,
  decodeBase64 as Base64ToUint8Array,
  decodeUTF8,
  encodeUTF8,
} from "tweetnacl-util";
import {
  entropyToMnemonic,
  generateMnemonic,
  mnemonicToEntropy,
} from "./BIP39";
type Base64String = string;
const newNonce = () => randomBytes(box.nonceLength);
export class Keychain {
  secretKey: Uint8Array;
  publicKey: Uint8Array;
  publicKeyAsString: string;
  secretKeyAsString: string;
  mnemonic: string;
  constructor(mnemonic?: string) {
    this.mnemonic = mnemonic;
  }
  async init() {
    if (!this.mnemonic) {
      this.mnemonic = await generateMnemonic();
    }
    const entropy = mnemonicToEntropy(this.mnemonic);

    console.log("HERE");
    const keyPair = box.keyPair.fromSecretKey(entropy);
    this.publicKey = keyPair.publicKey;
    this.secretKey = keyPair.secretKey;
    this.publicKeyAsString = Uint8ArrayToBase64(this.publicKey);
    this.secretKeyAsString = Uint8ArrayToBase64(this.secretKey);
  }
  exportPublic() {
    return Uint8ArrayToBase64(this.publicKey);
  }
  exportSecret() {
    return Uint8ArrayToBase64(this.secretKey);
  }
  encrypt(content: string, publicKey: Base64String): string {
    const nonce = newNonce();
    const encryptedMessage = box(
      decodeUTF8(content),
      nonce,
      Base64ToUint8Array(publicKey),
      this.secretKey
    );
    const encryptedMessageWithHead = new Uint8Array([
      ...Array.from(nonce),
      ...Array.from(this.publicKey),
      ...Array.from(encryptedMessage),
    ]);
    return Uint8ArrayToBase64(encryptedMessageWithHead);
  }
  decrypt(contentWithHead: Base64String): string {
    const contentWithHeadArray = Array.from(
      Base64ToUint8Array(contentWithHead)
    );
    const nonce = contentWithHeadArray.slice(0, box.nonceLength);
    const publicKey = contentWithHeadArray.slice(
      box.nonceLength,
      box.nonceLength + this.publicKey.length
    );
    const encryptedMessage = contentWithHeadArray.slice(
      box.nonceLength + this.publicKey.length
    );
    const decryptedMessage = box.open(
      new Uint8Array(encryptedMessage),
      new Uint8Array(nonce),
      new Uint8Array(publicKey),
      this.secretKey
    );
    return encodeUTF8(decryptedMessage);
  }
}
