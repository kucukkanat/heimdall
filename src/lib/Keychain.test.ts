import { Keychain } from "./Keychain";
import {
  encodeBase64 as Uint8ArrayToBase64,
  decodeBase64 as Base64ToUint8Array,
  decodeUTF8,
} from "tweetnacl-util";
// @ts-ignore
// import qrcode from "qrcode-terminal";
describe("Heimdall", () => {
  test("test test", async () => {
    const keychain1 = new Keychain();
    await keychain1.init();
    const keychain2 = new Keychain();
    await keychain2.init();
    const message = "Hello world";

    const encrypted = keychain1.encrypt(message, keychain2.exportPublic());
    const decrypted = keychain2.decrypt(encrypted);
    console.log({ encrypted, decrypted });
  });
});
