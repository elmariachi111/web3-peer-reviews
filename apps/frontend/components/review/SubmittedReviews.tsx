import { Heading, Table, Td, Th, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useTokenContract } from "../../hooks/useTokenContract"

export const SubmittedReviews = (props: { antid: string }) => {
  const { contract: reviewContract, chainConfig } = useTokenContract()

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

      console.log(allSubmittedReviews, filteredReviews)
    })()
  }, [chainConfig, props.antid, reviewContract])

  return (
    <>
      <Heading size="md">Submitted Peer Reviews</Heading>
      <Table>
        <Tr>
          <Th>Reviewer</Th>
        </Tr>
        {submittedReviews.map((submission) => (
          <Tr key={submission.args.antId}>
            <Td>{submission.args.peer_reviewer}</Td>
          </Tr>
        ))}
      </Table>
    </>
  )
}
