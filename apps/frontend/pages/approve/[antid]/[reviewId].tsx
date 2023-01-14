import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { useApprover } from "../../../hooks/useApprover"
import { useOrcidMap } from "../../../hooks/useOrcidMap"
import { useTokenContract } from "../../../hooks/useTokenContract"
import { SignedCommitment } from "../../../types"

type PeerReview = {
  accepted: boolean
  peer_reviewer: string
  reviewHash: string
  orcidProof: string
}

const VerifyPeerReviewer = (props: { peerReview: PeerReview }) => {
  const { peerReview } = props

  const { orcid } = useOrcidMap(peerReview.peer_reviewer)
  const [privateOrcid, setPrivateOrcid] = useState<string>()

  const { orchidContract } = useTokenContract()

  const [proofString, setProofString] = useState<string>("")

  const [error, setError] = useState<string>()
  const [isValid, setValid] = useState<boolean>()

  const proof: SignedCommitment = useMemo(() => {
    try {
      return JSON.parse(proofString)
    } catch (e: any) {
      return null
    }
  }, [proofString])

  useEffect(() => {
    if (!proof) {
      setError(undefined)
      setValid(false)
      return
    }

    const invalidate = (reason: string) => {
      setError(reason)
      setValid(false)
    }
    const conc = ethers.utils.hexConcat([
      proof.privateAddress,
      proof.signedPrivateAddress,
      proof.anonAddress,
      proof.signedAnonAddress,
    ])
    const hash = ethers.utils.keccak256(conc)
    if (hash != peerReview.orcidProof) {
      invalidate("proof hash is invalid")

      return
    }

    if (
      proof.anonAddress !==
      ethers.utils.verifyMessage(
        proof.privateAddress,
        proof.signedPrivateAddress
      )
    ) {
      invalidate("signature over private address is invalid")
      return
    }

    if (
      proof.privateAddress !==
      ethers.utils.verifyMessage(proof.anonAddress, proof.signedAnonAddress)
    ) {
      invalidate("signature over anon address is invalid")
      return
    }

    setValid(true)
  }, [peerReview.orcidProof, proof])

  useEffect(() => {
    if (!proof || !isValid || !orchidContract) return
    ;async () => {
      const _orcid = await orchidContract.addressToOrcid(proof.privateAddress)
      setPrivateOrcid(_orcid)
    }
  }, [proof, isValid, orchidContract])

  return (
    <Flex direction="column" gap={2}>
      <Heading size="md" mt={4}>
        {" "}
        Verify reviewer{" "}
      </Heading>

      <FormControl>
        <FormLabel>paste signed proof here</FormLabel>
        <Textarea
          rows={7}
          onChange={(e) => setProofString(e.target.value)}
        ></Textarea>
      </FormControl>
      <Button>verify</Button>
      <Text>{proof?.privateAddress}</Text>
    </Flex>
  )
}
export default function Approve() {
  const { query } = useRouter()
  const { antid, reviewId } = query

  const { contract: reviewContract, chainConfig } = useTokenContract()

  const { approver } = useApprover(antid as string)
  const [peerReview, setPeerReview] = useState<PeerReview>()

  useEffect(() => {
    if (!reviewContract) return
    ;(async () => {
      const _peerReview = await reviewContract.peer_reviews(
        antid as string,
        reviewId as string
      )
      setPeerReview(_peerReview)
    })()
  }, [antid, reviewContract, reviewId])

  return (
    <Flex direction="column">
      <Heading mb={4}>
        Approve Peer Review {antid}/{reviewId}
      </Heading>
      {!peerReview ? (
        "connect your wallet"
      ) : (
        <Flex direction="column">
          <Text>
            Submitted by {peerReview.peer_reviewer}{" "}
            <Link href={peerReview.reviewHash} isExternal>
              Review Content
            </Link>{" "}
          </Text>
          <Text></Text>
          <VerifyPeerReviewer peerReview={peerReview} />
        </Flex>
      )}
    </Flex>
  )
}
