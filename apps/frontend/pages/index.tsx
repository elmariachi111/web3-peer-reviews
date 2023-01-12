import { Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useTokenContract } from "../hooks/useTokenContract"

export default function Home() {
  const { address } = useAccount()
  const { contract: token } = useTokenContract()
  const [contractName, setContractName] = useState<string>()

  useEffect(() => {
    if (!token) return
    ;(async () => {
      setContractName(await token.name())
    })()
  }, [token])

  return (
    <Flex>
      <Text>{address}</Text>
      <Text>{contractName}</Text>
    </Flex>
  )
}
