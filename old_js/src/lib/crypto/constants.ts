export const Usage = {
  ENCRYPT: "encrypt",
  DECRYPT: "decrypt",
  SIGN: "sign",
  VERIFY: "verify",
  DERIVEKEY: "deriveKey",
  DERIVEBITS: "deriveBits",
  WRAPKEY: "wrapKey",
  UNWRAPKEY: "unwrapKey",
} as const;

export const Algorithm = {
  PBKDF2: "PBKDF2",
} as const;
