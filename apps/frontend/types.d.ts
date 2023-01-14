import type { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      // eth?: string;
      // roles?: string[];
      username?: string
      orcid?: string
      orc_access?: string
    }
  }
}

declare module "next-auth/jwt/types" {
  interface JWT {
    orcid?: string
    username?: string
    orc_access?: string
    // eth?: string;
    //    roles?: string[];
  }
}

export interface SignedCommitment {
  privateAddress: string
  signedPrivateAddress: string
  anonAddress: string
  signedAnonAddress: string
  reviewUrl: string
}
