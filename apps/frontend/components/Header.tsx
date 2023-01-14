import { Button, ButtonGroup, Link, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useTokenContract } from "../hooks/useTokenContract"

export const Header = () => {
  const { address } = useAccount()
  const [mappedOrcid, setMappedOrcid] = useState<string>()
  const { contract: reviewContract, orchidContract } = useTokenContract()

  useEffect(() => {
    if (!orchidContract || !address) return
    ;(async () => {
      setMappedOrcid(await orchidContract.addressToOrcid(address))
    })()
  }, [address, orchidContract])

  return (
    <Flex
      w="full"
      pb={2}
      my={4}
      align="center"
      justify="space-between"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
    >
      <Link href="/">P33R Review</Link>
      <ButtonGroup isAttached gap={2}>
        <ConnectButton />

        {mappedOrcid ? (
          <Flex direction="column">
            <div className="hover:underline">
              <Link href={`https://orcid.org/${mappedOrcid}`} target="_blank">
                {mappedOrcid}
              </Link>
            </div>
          </Flex>
        ) : (
          <Link
            as={Button}
            href={"https://orcidauth.vercel.app/register"}
            isExternal
          >
            Register with ORCID
          </Link>
        )}
      </ButtonGroup>
    </Flex>
  )
}
