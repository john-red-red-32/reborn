/** Reborna certificate-code format.
 * 24 base32 chars ~120 random bits. Never use a predictable sequence, timestamp,
 * artist slug or sale number as part of the secret code.
 */
export const CODE_ALPHABET="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_FORMAT=/^RB-(?:[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}-){3}[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/;

export function generateCertificateCode(random=globalThis.crypto){
 if(!random?.getRandomValues)throw new Error("Secure randomness unavailable");
 const values=new Uint8Array(24);
 random.getRandomValues(values);
 const chars=Array.from(values,x=>CODE_ALPHABET[x&31]).join("");
 return "RB-"+chars.match(/.{6}/g).join("-");
}

/** Case-insensitive, whitespace/hyphen tolerant; fail on any extra characters. */
export function normaliseCertificateCode(input){
 if(typeof input!=="string"||input.length>90)return null;
 const compact=input.trim().toUpperCase().replace(/[\s-]/g,"");
 if(!/^RB[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{24}$/.test(compact))return null;
 const chars=compact.slice(2);
 const value="RB-"+chars.match(/.{6}/g).join("-");
 return CODE_FORMAT.test(value)?value:null;
}
