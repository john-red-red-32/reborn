/** Reborna concealed certificate codes (v2).
 * 12 uniformly random characters from a human-readable 32-symbol alphabet:
 * 32^12 = 2^60 combinations. No predictable edition numbers or artist IDs
 * are embedded in a code. The physical code should be concealed under a
 * tamper-evident, peel-open or scratch-off seal.
 *
 * No production codes existed before this format migration.
 */
export const CODE_ALPHABET="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_FORMAT=/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}(?:-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}){2}$/;

export function generateCertificateCode(random=globalThis.crypto){
 if(!random?.getRandomValues)throw new Error("Secure randomness unavailable");
 const values=new Uint8Array(12);
 random.getRandomValues(values);
 const chars=Array.from(values,x=>CODE_ALPHABET[x&31]).join("");
 return chars.match(/.{4}/g).join("-");
}

/** Whitespace/hyphen and case tolerant. Reject invalid alphabet and lengths. */
export function normaliseCertificateCode(input){
 if(typeof input!=="string"||input.length>80)return null;
 const compact=input.trim().toUpperCase().replace(/[\s-]/g,"");
 if(!/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{12}$/.test(compact))return null;
 const formatted=compact.match(/.{4}/g).join("-");
 return CODE_FORMAT.test(formatted)?formatted:null;
}
