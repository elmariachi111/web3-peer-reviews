import { Flex, Text } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ReviewForm } from "../components/review/ReviewForm"
import { useTokenContract } from "../hooks/useTokenContract"

export default function Home() {
  const { contract: token } = useTokenContract()
  const [contractName, setContractName] = useState<string>()

  const { data, status } = useSession()
  useEffect(() => {
    if (!token) return
    ;(async () => {
      setContractName(await token.name())
    })()
  }, [token])

  console.log(data)

  return (
    <Flex direction="column">
      <Text>{contractName}</Text>
      <ReviewForm />
    </Flex>
  )
}
