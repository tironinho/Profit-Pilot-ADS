/**
 * Server-only crypto utilities for encrypting tokens (AES-256-GCM).
 * Tokens must NEVER be sent to the client.
 */

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 16;
const TAG_LEN = 16;

function getEncryptionKey() {
  const keyBase64 = process.env.APP_ENCRYPTION_KEY;
  if (!keyBase64 || keyBase64.length < 32) {
    throw new Error("APP_ENCRYPTION_KEY must be set and be at least 32 bytes (base64).");
  }
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== KEY_LEN) {
    throw new Error(`APP_ENCRYPTION_KEY must decode to exactly ${KEY_LEN} bytes.`);
  }
  return key;
}

/**
 * Encrypt a plain string. Returns a JSON string with iv, tag, ciphertext (all base64).
 * @param {string} plain
 * @returns {string} JSON blob to store in DB
 */
export function encryptString(plain) {
  if (plain == null || plain === "") return null;
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LEN });
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: enc.toString("base64"),
  });
}

/**
 * Decrypt a blob produced by encryptString.
 * @param {string} blob - JSON string with iv, tag, ciphertext
 * @returns {string} plain text
 */
export function decryptString(blob) {
  if (blob == null || blob === "") return null;
  const key = getEncryptionKey();
  let parsed;
  try {
    parsed = JSON.parse(blob);
  } catch {
    throw new Error("Invalid encryption blob: not valid JSON");
  }
  const { iv, tag, ciphertext } = parsed;
  if (!iv || !tag || !ciphertext) {
    throw new Error("Invalid encryption blob: missing iv, tag or ciphertext");
  }
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "base64"),
    { authTagLength: TAG_LEN }
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return decipher.update(ciphertext, "base64", "utf8") + decipher.final("utf8");
}
