import {
  Button,
  Heading,
  Table,
  Link as ChLink,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTokenContract } from "../hooks/useTokenContract"

const ApproverForReview = (props: { antid: string }) => {
  const { contract: reviewContract } = useTokenContract()
  const [approver, setApprover] = useState<string>()

  useEffect(() => {
    if (!reviewContract) return
    reviewContract.getApprover(props.antid, 0).then(setApprover)
  }, [props.antid, reviewContract])
  return (
    <Text maxWidth={100} isTruncated>
      {approver}
    </Text>
  )
}

export default function RequestList() {
  const { contract: reviewContract, chainConfig } = useTokenContract()
  const [allReviewRequests, setAllReviewRequests] = useState<any[]>([])
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
      <Heading>{allReviewRequests.length} requested reviews</Heading>
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
                <Text maxWidth={100} isTruncated>
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
                  {r.args.paperHash}
                </Text>
              </Td>
              <Td>
                <Link href={`/review/${r.args.antId}`} passHref legacyBehavior>
                  <ChLink as={Button}>Review</ChLink>
                </Link>
              </Td>
            </Tr>
          )
        })}
      </Table>
    </>
  )
}
