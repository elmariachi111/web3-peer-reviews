import type { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      // eth?: string;
      // roles?: string[];
      username?: string
    }
  }
}

declare module "next-auth/jwt/types" {
  interface JWT {
    uid?: string
    username?: string
    // eth?: string;
    //    roles?: string[];
  }
}
