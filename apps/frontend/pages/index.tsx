import {
  Button,
  Heading,
  Table,
  Link,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Flex,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useTokenContract } from "../hooks/useTokenContract"

const ApproverForReview = (props: { antid: string }) => {
  const { contract: reviewContract } = useTokenContract()
  const [approver, setApprover] = useState<string>()

  useEffect(() => {
    if (!reviewContract) return
    reviewContract.getApprover(props.antid, 0).then(setApprover)
  }, [props.antid, reviewContract])
  return (
    <Text maxWidth={150} isTruncated>
      {approver}
    </Text>
  )
}

export default function RequestList() {
  const { contract: reviewContract, chainConfig } = useTokenContract()
  const [allReviewRequests, setAllReviewRequests] = useState<any[]>([])
  const { isConnected } = useAccount()
  useEffect(() => {
    if (!reviewContract || !chainConfig) return
    ;(async () => {
      const allReviews = await reviewContract.queryFilter(
        reviewContract?.filters.AntReviewIssued(),
        chainConfig?.antreview.block || 0
      )
      setAllReviewRequests(allReviews)
      console.log(allReviews)
    })()
  }, [chainConfig, reviewContract])
  return (
    <>
      <Flex justify="space-between" mb={6}>
        <Heading>{allReviewRequests.length} requested reviews</Heading>
        <NextLink href="/issue" passHref>
          {isConnected && (
            <Button as="a" colorScheme="purple">
              New review request
            </Button>
          )}
        </NextLink>
      </Flex>
      <Table>
        <Tr>
          <Th>Id</Th>
          <Th>Issuer</Th>
          <Th>Approver</Th>
          <Th>Deadline</Th>
          <Th>Paper CID</Th>
          <Th>Actions</Th>
        </Tr>
        {allReviewRequests.map((r) => {
          return (
            <Tr key={r.args.antId}>
              <Td>{r.args.antId.toNumber()}</Td>
              <Td>
                <Text maxWidth={150} isTruncated>
                  {r.args.issuers[0]}
                </Text>
              </Td>
              <Td>
                <ApproverForReview antid={r.args.antId} />
              </Td>
              <Td>
                {new Date(r.args.deadline.toNumber()).toLocaleDateString()}
              </Td>
              <Td>
                <Text maxWidth={100} isTruncated>
                  <Link
                    href={`https://w3s.link/ipfs/${r.args.paperHash}`}
                    isExternal
                  >
                    {r.args.paperHash}
                  </Link>
                </Text>
              </Td>
              <Td>
                <NextLink
                  href={`/review/${r.args.antId}`}
                  passHref
                  legacyBehavior
                >
                  <Button as="a" colorScheme="pink">
                    Review
                  </Button>
                </NextLink>
              </Td>
            </Tr>
          )
        })}
      </Table>
    </>
  )
}
