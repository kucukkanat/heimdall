import { describe, test, expect } from "./testing-library";
import { Wallet } from "./Wallet";

describe("wallet tests", () => {
  test("Create wallet", async function () {
    const wallet = new Wallet();
    await wallet.init();
    const message = "Hello world";
    const signature = wallet.sign(message);
    const verification = Wallet.verify(message, signature);
    expect(verification).toBe(true);
  });

  test("Create wallet from mnemonic", async function () {
    const wallet = new Wallet();
    await wallet.init();
    const wallet2 = new Wallet(wallet.mnemonic);
    await wallet2.init();
    expect(wallet.publicKeyAsString === wallet2.publicKeyAsString).toBe(true);
  });
  test("Sign and verify with the wallet", async function () {
    const wallet = new Wallet()
    await wallet.init()

    const message = "My message"
    // Signatue will already include the detached signature and the public key of the signer
    const signature = wallet.sign(message)
    const verification = Wallet.verify(message, signature)
  })
});
