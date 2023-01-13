import { Flex, Text } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useTokenContract } from "../hooks/useTokenContract"

export default function Home() {
  const { address } = useAccount()
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
      <Text>{address}</Text>
      <Text>{contractName}</Text>
      <Text>{data?.user?.username}</Text>
    </Flex>
  )
}
