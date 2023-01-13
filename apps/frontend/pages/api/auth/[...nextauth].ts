import NextAuth from "next-auth"
import type { OAuthConfig } from "next-auth/providers"
import type { AuthOptions } from "next-auth"

const OcridAuthProvider: OAuthConfig<{ name: string }> = {
  id: "orcid",
  name: "ORCId",
  type: "oauth",
  clientId: process.env.ORCID_ID as string,
  clientSecret: process.env.ORCID_SECRET as string,
  wellKnown: `${process.env.ORCID_ENDPOINT}/.well-known/openid-configuration`,

  idToken: true,
  profile(profile: any) {
    const _profile = {
      id: `${process.env.ORCID_ENDPOINT}/${profile.sub}`,
      ...profile,
    }
    //console.log(`profile`, _profile)
    return _profile
  },
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [OcridAuthProvider],
  debug: true,
  callbacks: {
    async session({ session, token, user }) {
      //console.log("SESSION callback", session, token, user)
      if (!session.user) {
        console.log("NO USER IN SESSION")
        return session
      }
      //session.user.id = token.sub

      session.user.username = token.username
      session.user.orc_access = token.orc_access
      session.user.orcid = token.orcid

      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //console.log("JWT callback", token, user, account, profile, isNewUser)
      if (account?.providerAccountId) {
        token.sub = account.providerAccountId
      }
      if (account?.name) {
        token.username = account.name as string
        token.orcid = account.orcid as string
        token.orc_access = account.access_token
      }

      return token
    },
  },
}

export default NextAuth(authOptions)
