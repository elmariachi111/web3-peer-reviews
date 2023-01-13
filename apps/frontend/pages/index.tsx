import { Flex, Text } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import { ReviewForm } from "../components/review/ReviewForm"
import { useTokenContract } from "../hooks/useTokenContract"

export default function Home() {
  const { contract: reviewContract, orchidContract } = useTokenContract()
  //const [reviewContract, setReviewContract] = useState<>()
  const { address } = useAccount()

  const { data } = useSession()
  useEffect(() => {
    if (!reviewContract || !address) return
    console.log(reviewContract.address)
    ;(async () => {
      const result = await reviewContract.isIssuer(address)
      console.log("isIssuer", result)
    })()
  }, [address, reviewContract])

  useEffect(() => {
    if (!orchidContract || !address) return
    ;(async () => {
      const result = await orchidContract.addressToOrcid(address)
      console.log("orchid address map", result)
    })()
  }, [address, orchidContract])

  return (
    <Flex direction="column">
      <Text>foo</Text>
      <ReviewForm />
    </Flex>
  )
}
