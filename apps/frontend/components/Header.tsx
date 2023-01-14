import { Button, ButtonGroup, Link, Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useTokenContract } from "../hooks/useTokenContract"
import NextLink from "next/link"

export const Header = () => {
  const { address, isConnected } = useAccount()
  const [mappedOrcid, setMappedOrcid] = useState<string>()
  const { orchidContract } = useTokenContract()

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
      <NextLink href="/">
        <Text fontWeight="bold" fontStyle="italic" fontSize="2xl">
          P33R Review
        </Text>
      </NextLink>
      <ButtonGroup isAttached gap={2} alignItems="center">
        <ConnectButton />

        {mappedOrcid ? (
          <Flex direction="column" align="center" fontSize="sm">
            <Text>Orcid connected</Text>
            <Link
              href={`https://orcid.org/${mappedOrcid}`}
              isExternal
              fontSize="xs"
            >
              {mappedOrcid}
            </Link>
          </Flex>
        ) : isConnected ? (
          <NextLink
            href="https://orcidauth.vercel.app/register"
            passHref
            legacyBehavior
          >
            <Button as="a" target="_blank">
              Connect your ORCID
            </Button>
          </NextLink>
        ) : (
          <></>
        )}
      </ButtonGroup>
    </Flex>
  )
}
