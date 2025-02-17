import { Algorithm, Usage } from "./constants";

export async function PBKDF2(
  password: string,
  salt: ArrayBuffer | TypedArray | DataView,
  iterations: Number,
) {
  const algorithm = Algorithm.PBKDF2;
  const usages = [
    Usage.ENCRYPT,
    Usage.DECRYPT,
    Usage.SIGN,
    Usage.VERIFY,
    Usage.DERIVEBITS,
    Usage.DERIVEKEY,
    Usage.WRAPKEY,
    Usage.UNWRAPKEY,
  ];
  const Pbkdf2Params = {
    name: algorithm,
    hash: "SHA-512",
    slat: salt,
    iterations: iterations,
  };

  const AesKeyGenParams = {
    name: "AES-GCM",
    length: 256,
  };

  const encoder = new TextEncoder();
  const keyData = encoder.encode(password);
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    algorithm,
    false,
    usages,
  );

  return window.crypto.subtle.deriveKey(
    Pbkdf2Params,
    baseKey,
    AesKeyGenParams,
    true,
    usages,
  );
}

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;
