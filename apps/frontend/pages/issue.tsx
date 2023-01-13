import { Button, Flex, Link, Text, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ReviewForm } from "../components/review/ReviewForm"
import { useTokenContract } from "../hooks/useTokenContract"

export default function Issue() {
  const { contract: reviewContract, orchidContract } = useTokenContract()
  const [hasIssuerRole, setHasIssuerRole] = useState<boolean>()
  const [mappedOrcid, setMappedOrcid] = useState<string>()

  const { address } = useAccount()

  const { data } = useSession()

  const toast = useToast()
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

  const submitReviewRequest = useCallback(
    async (data: {
      issuer: string
      approver: string
      paperCid: string
      deadline: Date
    }) => {
      const result = await reviewContract?.issueAntReview(
        [data.issuer],
        data.approver,
        data.paperCid,
        "",
        Math.floor(data.deadline.getTime())
      )
      console.log(result)
      toast({
        title: "created review request",
        description: "now wait for peer reviewers to show up",
      })
    },
    [reviewContract, toast]
  )

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
      <ReviewForm onSubmit={submitReviewRequest} />
    </Flex>
  )
}
