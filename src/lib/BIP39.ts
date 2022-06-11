import { wordlist } from "./wordlist";
const ENTROPY_STRENGTH_ERROR = "Wrong entropy strength";
const ENTROPY_STRENGTH_TOO_SMALL_ERROR =
  "Entropy strength must be bigger than 32 bits";

//bits
const SHA256 = async (data: Uint8Array) => {
  const digested = await crypto.subtle.digest("SHA-256", data);
  // 256 bit ArrayBuffer = 32 byte Uint8Array
  return new Uint8Array(digested);
};
/**
 * Creates an entropy of Strength/8 bytes
 * 256 for 32 bytes
 * 128 for 16 bytes
 * @param {number} strength - Strength as bits
 * @returns {Uint8Array} - Entropy length will be strength/8
 */
export const createEntropy = (strength: number = 256) => {
  if (strength % 8 !== 0) {
    console.log({ strength });
    throw new Error(ENTROPY_STRENGTH_ERROR);
  }
  if (strength < 32) {
    throw new Error(ENTROPY_STRENGTH_TOO_SMALL_ERROR);
  }
  return crypto.getRandomValues(new Uint8Array(strength / 8));
};
const byte2bin = (byte: number) => byte.toString(2).padStart(8, "0");
const bin2byte = (bin: string) => parseInt(bin, 2);
const Array2BitString = (arr: Uint8Array | Array<number>) =>
  Array.from(arr).map(byte2bin).join("");

export async function calculateChecksum(entropy: Uint8Array) {
  const hashResult = await SHA256(entropy);
  const strengthAsBits = entropy.length * 8;

  const hashResultAsBitString = Array2BitString(hashResult);
  // Take first ENTROPY_LENGTH/32 bits of entropy's hash
  // Add 1 bit of checksum per each 32 bit
  return hashResultAsBitString.slice(0, strengthAsBits / 32);
}

export async function entropyToMnemonic(entropy: Uint8Array): Promise<string> {
  const checksum = await calculateChecksum(entropy);
  const bits = Array2BitString(entropy) + checksum;
  const chunks = bits.match(/(.{1,11})/g);
  const words = chunks!.map((binary) => {
    const index = bin2byte(binary);
    return wordlist[index];
  });

  return words.join(" ");
}

export function mnemonicToEntropy(mnemonicString: string): Uint8Array {
  const mnemonics = mnemonicString.trim().split(" ");
  const bitString = mnemonics
    .map((mnemonic) => wordlist.indexOf(mnemonic))
    .map((i) => i.toString(2).padStart(11, "0"))
    .join("");
  const dividerIndex = Math.floor(bitString.length / 33) * 32;
  const entropyBits = bitString.slice(0, dividerIndex);
  const entropyBytes = entropyBits.match(/(.{1,8})/g).map(bin2byte);
  return new Uint8Array(entropyBytes);
}

/**
 * Generates mnemonic with the given strength as bits
 * @param {number} strength - Strength as bits
 * @returns {string}
 */
export async function generateMnemonic(strength: number = 256) {
  const entropy = createEntropy(strength);
  const mnemonic = await entropyToMnemonic(entropy);
  return mnemonic;
}
