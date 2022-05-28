import { Keychain } from "./Keychain";
import {
  encodeBase64 as Uint8ArrayToBase64,
  decodeBase64 as Base64ToUint8Array,
  decodeUTF8,
} from "tweetnacl-util";
// @ts-ignore
// import qrcode from "qrcode-terminal";
describe("Heimdall", () => {
  test("test test", () => {
    const keychain = new Keychain();
    const publicKey = keychain.exportPublic();
    const privateKey = keychain.exportSecret();
    // qrcode.generate(privateKey, console.log);
    console.log({ publicKey, privateKey });
    const message = "Hello world";
    const messageUint8Array = decodeUTF8(message);
    const signature = keychain.sign(messageUint8Array);
    console.log({ signature });

    const verification = 
  });
});
