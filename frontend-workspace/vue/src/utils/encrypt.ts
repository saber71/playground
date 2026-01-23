import JsEncrypt from "jsencrypt";

const jsencrypt = new JsEncrypt();

export async function initPublicKey(publicKeyGetter: () => Promise<string>) {
  jsencrypt.setPublicKey(await publicKeyGetter());
}

export function encrypt(plain: string) {
  const result = jsencrypt.encrypt(plain);
  if (!result) {
    throw new Error("Encryption failed");
  }
  return result;
}
