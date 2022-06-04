import { Wallet } from "./Wallet";

describe("wallet tests", () => {
  test("Create wallet", async function () {
    const wallet = new Wallet();
    await wallet.init();
    const message = "Hello world";
    const signature = wallet.sign(message);
    const verification = wallet.verify(message, signature);
    expect(verification).toBe(true);
  });

  test("Create wallet from mnemonic", async function () {
    const wallet = new Wallet();
    await wallet.init();
    const wallet2 = new Wallet(wallet.mnemonic);
    await wallet2.init();
    expect(wallet.publicKeyAsString === wallet2.publicKeyAsString).toBe(true);
  });
});
