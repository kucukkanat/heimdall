import { generateMnemonic } from "./BIP39";

describe("BIP39 Tests", () => {
  test("Creates a different mnemonic every time", async () => {
    const mnemonic = await generateMnemonic();
    const mnemonic2 = await generateMnemonic();
    expect(mnemonic !== mnemonic2).toBeTruthy();
  });

  test("Creates a mnemonic with 3 words per 32 bit", async () => {
    let i = 0;
    for (i = 1; i <= 8; i++) {
      const mnemonic = await generateMnemonic(i * 32);
      const mnemonicWords = mnemonic.split(" ");
      expect(mnemonicWords.length).toBe(i * 3);
    }
  });
});
