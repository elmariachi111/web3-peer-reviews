import { Box, Button, Code, Flex, Heading, Text } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { CommitmentForm } from "../../components/commitment/CommitmentForm"
import { SubmittedReviews } from "../../components/review/SubmittedReviews"
import { useTokenContract } from "../../hooks/useTokenContract"
import { SignedCommitment } from "../../types"

export default function Review() {
  const { query } = useRouter()
  const { antid } = query
  const { contract: antContract } = useTokenContract()

  const [signedCommitment, setSignedCommitment] = useState<SignedCommitment>()
  const [commitmentDisclosure, setCommitmentDisclosure] = useState<any>({})

  const [approver, setApprover] = useState<string>()

  useEffect(() => {
    if (!antContract) return
    antContract.getApprover(antid as string, 0).then(setApprover)
  }, [antContract, antid])

  const anchorCommitment = useCallback(async () => {
    if (!signedCommitment || !antContract) return
    const conc = ethers.utils.hexConcat([
      signedCommitment.privateAddress,
      signedCommitment.signedPrivateAddress,
      signedCommitment.anonAddress,
      signedCommitment.signedAnonAddress,
    ])
    const hash = ethers.utils.keccak256(conc)
    await antContract.submitPeerReview(
      antid as string,
      signedCommitment.reviewUrl,
      hash
    )

    console.log("commitment hash", signedCommitment, conc, hash)
    setCommitmentDisclosure({ ...signedCommitment, hash })
  }, [antContract, antid, signedCommitment])

  return (
    <Flex direction="column" gap={4}>
      <Flex direction="row" align="center" justify="space-between">
        <Heading mb={2}>Peer review request #{antid}</Heading>
        {approver && (
          <Box textAlign="right" fontSize="sm">
            can be approved by{" "}
            <Text maxW={200} isTruncated>
              {approver}
            </Text>
          </Box>
        )}
      </Flex>
      <Heading size="md">Submitted Peer Reviews</Heading>
      <SubmittedReviews antid={antid as string} approver={approver} />

      <Flex my={4} w="full" direction="column">
        <Heading size="md" mb={2}>
          Commit to peer review this request
        </Heading>
        <CommitmentForm onSubmit={setSignedCommitment} />
        {signedCommitment && (
          <Flex direction="column">
            <Flex direction="row" w="full" gap={2} my={4}>
              <Button onClick={() => anchorCommitment()} colorScheme="pink">
                Publish empty review on chain
              </Button>
              <Button colorScheme="purple">
                Disclose commitment to approver
              </Button>
            </Flex>
            <Text>
              Disclose this to the request&apos;s approver if you trust them:
            </Text>
            {commitmentDisclosure && (
              <Code p={2}>
                <pre>{JSON.stringify(commitmentDisclosure, null, 2)}</pre>
              </Code>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
