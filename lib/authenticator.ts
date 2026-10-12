/** Secure certificate registry specification. No live verification data exists yet. */
export type AuthenticityStatus="not_found"|"active"|"revoked"|"retired";
export type VerificationEvent={at:string;region?:string};
export type PublicVerificationResult={status:AuthenticityStatus;artist?:string;kit?:string;edition?:string;checkedAt:string;priorChecks:number;recentChecks:VerificationEvent[];explanation:string};
export const AUTHENTICATOR_SPEC={
 entropyBits:128,
 issuedOnlyTo:"verified sculptor accounts",
 storage:"server-generated cryptographic random; keyed HMAC digest; never plaintext logs",
 uniqueness:"one code per physical kit; immutable unique database index",
 states:["issued","active","revoked","retired"],
 lookup:"rate-limited API with bot protection and enumeration monitoring",
 privacy:"aggregate check counts and coarse dates only; never buyer IP or identity",
 caveat:"A valid code is not proof the physical kit is genuine; copied codes can be replayed",
 review:"artist revocation and manual fraud reporting"
} as const;
