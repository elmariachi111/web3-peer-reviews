import { Button, Flex, Heading } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { CommitmentForm } from "../../components/commitment/CommitmentForm"
import { SignedCommitment } from "../../types"

export default function Review() {
  const { query } = useRouter()
  const { antid } = query

  const [signedCommitment, setSignedCommitment] = useState<SignedCommitment>()

  const anchorCommitment = useCallback(async () => {
    if (!signedCommitment) return
    const conc = ethers.utils.hexConcat([
      signedCommitment.privateAddress,
      signedCommitment.signedPrivateAddress,
      signedCommitment.anonAddress,
      signedCommitment.signedAnonAddress,
    ])
    const hash = ethers.utils.keccak256(conc)
    console.log("commitment hash", signedCommitment, conc, hash)
  }, [signedCommitment])

  return (
    <Flex direction="column">
      <Heading mb={2}>Apply to peer review {antid}</Heading>
      <Flex my={4} w="100%" direction="column">
        <Heading size="md" mb={2}>
          Create Commitment
        </Heading>
        {signedCommitment ? (
          <Flex direction="row" w="full" gap={2}>
            <Button onClick={() => anchorCommitment()} colorScheme="pink">
              Publish empty review on chain
            </Button>
            <Button colorScheme="purple">
              Disclose commitment to approver
            </Button>
          </Flex>
        ) : (
          <CommitmentForm onSubmit={setSignedCommitment} />
        )}
      </Flex>
    </Flex>
  )
}
