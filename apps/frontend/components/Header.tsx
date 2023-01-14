import { Button, ButtonGroup, Flex, Link, Text } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import NextLink from "next/link"
import { useAccount } from "wagmi"
import { useOrcidMap } from "../hooks/useOrcidMap"

export const Header = () => {
  const { address, isConnected } = useAccount()

  const { orcid } = useOrcidMap(address)
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

        {orcid ? (
          <Flex direction="column" align="center" fontSize="sm">
            <Text>Orcid connected</Text>
            <Link href={`https://orcid.org/${orcid}`} isExternal fontSize="xs">
              {orcid}
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
