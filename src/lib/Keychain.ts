import { sign } from "tweetnacl";
import {
  encodeBase64 as Uint8ArrayToBase64,
  decodeBase64 as Base64ToUint8Array,
} from "tweetnacl-util";
import { Base64String } from "./common.types";

export class Keychain {
  secretKey: Uint8Array;
  publicKey: Uint8Array;
  constructor() {
    const keyPair = sign.keyPair();
    this.publicKey = keyPair.publicKey;
    this.secretKey = keyPair.secretKey;
  }
  exportPublic() {
    return Uint8ArrayToBase64(this.publicKey);
  }
  exportSecret() {
    return Uint8ArrayToBase64(this.secretKey);
  }
  sign(content: Uint8Array): Base64String {
    const signature = sign.detached(content, this.secretKey);
    return Uint8ArrayToBase64(signature);
  }
  static verify(
    content: Uint8Array,
    signature: Base64String,
    publicKey: Uint8Array
  ): boolean {
    const signatureUint8 = Base64ToUint8Array(signature);
    return sign.detached.verify(signatureUint8, content, publicKey);
  }
}
