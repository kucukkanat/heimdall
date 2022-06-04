import { sign } from "tweetnacl";
import { mnemonicToEntropy, generateMnemonic } from "./BIP39";
import {
  decodeUTF8,
  encodeBase64 as Uint8ArrayToBase64,
  decodeBase64 as Base64ToUint8Array,
} from "tweetnacl-util";

type Base64String = string;
export class Wallet {
  secretKey: Uint8Array;
  publicKey: Uint8Array;
  publicKeyAsString: string;
  secretKeyAsString: string;
  mnemonic: string;
  constructor(mnemonic?: string | undefined) {
    this.mnemonic = mnemonic;
  }
  async init() {
    if (!this.mnemonic) {
      this.mnemonic = await generateMnemonic();
    }

    const seed = mnemonicToEntropy(this.mnemonic);
    const { secretKey, publicKey } = sign.keyPair.fromSeed(seed);
    this.secretKey = secretKey;
    this.publicKey = publicKey;
    this.publicKeyAsString = Uint8ArrayToBase64(this.publicKey);
    this.secretKeyAsString = Uint8ArrayToBase64(this.secretKey);
  }
  sign(message: string): Base64String {
    const signature = sign.detached(decodeUTF8(message), this.secretKey);
    const signatureWithMyPublicKey = new Uint8Array([
      ...Array.from(this.publicKey),
      ...Array.from(signature),
    ]);
    return Uint8ArrayToBase64(signatureWithMyPublicKey);
  }
  verify(message: string, signature: Base64String) {
    const signatureArray = Array.from(Base64ToUint8Array(signature));
    const signerPublicKey = signatureArray.slice(0, this.publicKey.length);
    const detachedSignature = signatureArray.slice(this.publicKey.length);
    const verification = sign.detached.verify(
      decodeUTF8(message),
      new Uint8Array(detachedSignature),
      new Uint8Array(signerPublicKey)
    );
    return verification;
  }
}
