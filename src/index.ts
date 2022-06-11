import { Wallet } from "./lib/Wallet"
import { Keychain } from "./lib/Keychain"

(async () => {
    const wallet = new Wallet()
    await wallet.init()
    const keychain = new Keychain()
    const keychain2 = new Keychain()
    await keychain.init()
    await keychain2.init()
    const message = "Hello world"

    const signature = wallet.sign(message)
    const verification = Wallet.verify(message, signature)
    const verification2 = Wallet.verify(message + "a", signature)

    const encrypted = keychain.encrypt(message, keychain2.publicKeyAsString)
    const decrypted = keychain2.decrypt(encrypted)

    console.log({ encrypted, decrypted, signature, verification, verification2 })

})()
