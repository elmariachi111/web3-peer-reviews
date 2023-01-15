import { Box, Button, Code, Flex, Heading, Text } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useAccount } from "wagmi"
import { CommitmentForm } from "../../components/commitment/CommitmentForm"
import { SubmittedReviews } from "../../components/review/SubmittedReviews"
import { useApprover } from "../../hooks/useApprover"
import { useTokenContract } from "../../hooks/useTokenContract"
import { SignedCommitment } from "../../types"
import download from "downloadjs"

export default function Review() {
  const { query } = useRouter()
  const { antid } = query
  const { contract: antContract } = useTokenContract()
  const { address } = useAccount()

  const [signedCommitment, setSignedCommitment] = useState<SignedCommitment>()
  const [commitmentDisclosure, setCommitmentDisclosure] = useState<any>()

  const { approver } = useApprover(antid as string)

  const downloadCommitment = useCallback(() => {
    download(
      JSON.stringify(commitmentDisclosure, null, 2),
      `commitment-${antid}`,
      "application/json"
    )
  }, [antid, commitmentDisclosure])

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
      <SubmittedReviews antid={antid as string} approver={approver} />
      <Flex my={4} w="full" direction="column">
        <Heading size="md" mb={2}>
          Commit to peer review this request
        </Heading>
        <CommitmentForm onSubmit={setSignedCommitment} />
        {signedCommitment && (
          <Flex direction="column">
            <Button
              onClick={() => anchorCommitment()}
              colorScheme="pink"
              my={6}
              disabled={
                address?.toLowerCase() !=
                signedCommitment.anonAddress.toLowerCase()
              }
            >
              {address?.toLowerCase() !=
              signedCommitment.anonAddress.toLowerCase()
                ? "switch to anon account to submit"
                : "Submit peer review"}
            </Button>

            {commitmentDisclosure && (
              <Flex direction="column">
                <Text>
                  Disclose this to the request&apos;s approver if you trust
                  them:
                </Text>
                <Code p={2} minH={48}>
                  <pre>{JSON.stringify(commitmentDisclosure, null, 2)}</pre>
                </Code>
                <Button
                  colorScheme="purple"
                  onClick={() => downloadCommitment()}
                >
                  Download secret commitment
                </Button>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
