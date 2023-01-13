import { Heading, Table, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useTokenContract } from "../hooks/useTokenContract"

export default function RequestList() {
  const { contract: reviewContract, orchidContract } = useTokenContract()
  const [allReviewRequests, setAllReviewRequests] = useState<any[]>([])
  useEffect(() => {
    if (!reviewContract) return
    ;(async () => {
      const allReviews = await reviewContract.queryFilter(
        reviewContract?.filters.AntReviewIssued(),
        0
      )
      setAllReviewRequests(allReviews)
      console.log(allReviews)
    })()
  }, [reviewContract])
  return (
    <>
      <Heading>{allReviewRequests.length} requested reviews</Heading>
      <Table>
        <Tr>
          <Th>Id</Th>
          <Th>Issuer</Th>

          <Th>Deadline</Th>
          <Th>Paper CID</Th>
        </Tr>
        {allReviewRequests.map((r) => {
          return (
            <Tr key={r.args.antId}>
              <Td>{r.args.antId.toNumber()}</Td>
              <Td>{r.args.issuers[0]}</Td>

              <Td>{new Date(r.args.deadline.toNumber()).toISOString()}</Td>
              <Td>{r.args.paperHash}</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  )
}
