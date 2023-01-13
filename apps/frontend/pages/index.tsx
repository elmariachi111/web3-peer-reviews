import { Button, Flex, Link, Text } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ReviewForm } from "../components/review/ReviewForm"
import { useTokenContract } from "../hooks/useTokenContract"

export default function Home() {
  const { contract: reviewContract, orchidContract } = useTokenContract()
  const [hasIssuerRole, setHasIssuerRole] = useState<boolean>()
  const [mappedOrcid, setMappedOrcid] = useState<string>()

  const { address } = useAccount()

  const { data } = useSession()

  useEffect(() => {
    if (!reviewContract || !address) return
    ;(async () => {
      const _isIssuer = await reviewContract.isIssuer(address)
      console.log("moo", _isIssuer)
      setHasIssuerRole(_isIssuer)
    })()
  }, [address, reviewContract])

  const grantIssuerRole = useCallback(async () => {
    if (!address) {
      return
    }
    const result = await reviewContract?.addIssuer(address)
    console.log(result)
  }, [address, reviewContract])

  useEffect(() => {
    if (!orchidContract || !address) return
    ;(async () => {
      setMappedOrcid(await orchidContract.addressToOrcid(address))
    })()
  }, [address, orchidContract])

  return (
    <Flex direction="column">
      {hasIssuerRole ? (
        <Text>You can issue review requests</Text>
      ) : mappedOrcid ? (
        <Button onClick={() => grantIssuerRole()}>Claim issuer role</Button>
      ) : (
        <Link href="https://orcidauth.vercel.app" isExternal>
          Map your orcid to your address first
        </Link>
      )}
      <ReviewForm />
    </Flex>
  )
}
