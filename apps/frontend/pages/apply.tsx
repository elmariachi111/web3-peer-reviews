import { Heading } from "@chakra-ui/react"
import { CommitmentForm } from "../components/commitment/CommitmentForm"

export default function Apply() {
  const createReviewCommitment = (data: {
    privateAddress: string
    anonAddress: string
  }) => {
    console.log(data)
  }

  return (
    <>
      <Heading mb={2}>Apply as a peer reviewer</Heading>
      <Heading size="md">Create Commitment</Heading>
      <CommitmentForm onSubmit={createReviewCommitment} />
    </>
  )
}
