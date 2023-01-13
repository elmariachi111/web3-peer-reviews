import { Button, Flex, Heading } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useSignMessage } from "wagmi"
import { CommitmentForm } from "../../components/commitment/CommitmentForm"

export default function Commit() {
  const { query } = useRouter()
  const { antid } = query

  const { signMessageAsync } = useSignMessage()
  const [signedCommitment, setSignedCommitment] = useState<{
    message: string
    signedMessage: string
  }>()

  const createReviewCommitment = async (data: {
    privateAddress: string
    anonAddress: string
  }) => {
    const nonce = Math.floor(Math.random() * 1_000_000)

    const _message = `undisclosed:${data.privateAddress}\n\npublic:${data.anonAddress}\n\nnonce:${nonce}`
    const _signedMessage = await signMessageAsync({
      message: _message,
    })
    setSignedCommitment({
      message: _message,
      signedMessage: _signedMessage,
    })
  }

  const anchorCommitment = useCallback(async () => {
    console.log(signedCommitment)
  }, [signedCommitment])

  return (
    <Flex direction="column">
      <Heading mb={2}>Apply as a peer reviewer for {antid}</Heading>
      <Flex my={4} w="100%" direction="column">
        <Heading size="md" mb={2}>
          Create Commitment
        </Heading>
        {signedCommitment ? (
          <Flex direction="row" w="full" gap={2}>
            <Button onClick={() => anchorCommitment()} colorScheme="pink">
              Publish commitment to chain
            </Button>
            <Button colorScheme="purple">
              Disclose commitment to approver
            </Button>
          </Flex>
        ) : (
          <CommitmentForm onSubmit={createReviewCommitment} />
        )}
      </Flex>
    </Flex>
  )
}
