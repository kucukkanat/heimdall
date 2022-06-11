import { describe, test, expect } from "./testing-library";
import { Keychain } from "./Keychain";

// @ts-ignore
// import qrcode from "qrcode-terminal";
describe("Heimdall", () => {
  test("Keychain encryption test", async () => {
    const keychain1 = new Keychain();
    await keychain1.init();
    const keychain2 = new Keychain();
    await keychain2.init();
    const message = "Hello world";

    const encrypted = keychain1.encrypt(message, keychain2.exportPublic());
    const decrypted = keychain2.decrypt(encrypted);
    expect(decrypted).toEqual(message);
  });
});
