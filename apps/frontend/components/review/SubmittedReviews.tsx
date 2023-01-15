import { Button, Link, Table, Td, Text, Th, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useTokenContract } from "../../hooks/useTokenContract"
import NextLink from "next/link"

export const SubmittedReviews = (props: {
  antid: string
  approver?: string
}) => {
  const { contract: reviewContract, chainConfig } = useTokenContract()
  const { address } = useAccount()

  const [submittedReviews, setSubmittedReviews] = useState<any[]>([])

  useEffect(() => {
    if (!reviewContract || !chainConfig) return
    ;(async () => {
      const allSubmittedReviews = await reviewContract.queryFilter(
        reviewContract?.filters.AntReviewFulfilled(),
        chainConfig?.antreview.block || 0
      )
      //omg. add an `index` to the event to sanify this.
      const filteredReviews = allSubmittedReviews.filter(
        (subm) => subm.args.antId.toNumber() == parseInt(props.antid)
      )
      setSubmittedReviews(filteredReviews)

      //console.log(allSubmittedReviews, filteredReviews)
    })()
  }, [chainConfig, props.antid, reviewContract])

  return (
    <Table>
      <Tr>
        <Th>Reviewer</Th>
        <Th>Review</Th>
        <Th>Actions</Th>
      </Tr>
      {submittedReviews.map((submission) => (
        <Tr
          key={`${submission.args.antId.toNumber()}-${submission.args.reviewId.toNumber()}`}
        >
          <Td>{submission.args.peer_reviewer}</Td>
          <Td>
            <Link href={submission.args.reviewHash} isExternal>
              <Text maxW={300} isTruncated>
                {submission.args.reviewHash}
              </Text>
            </Link>
          </Td>
          <Td>
            {props.approver?.toLowerCase() === address?.toLowerCase() && (
              <NextLink
                href={`/approve/${props.antid}/${submission.args.reviewId}`}
                passHref
              >
                <Button as="a" colorScheme="pink">
                  approve
                </Button>
              </NextLink>
            )}
          </Td>
        </Tr>
      ))}
    </Table>
  )
}
