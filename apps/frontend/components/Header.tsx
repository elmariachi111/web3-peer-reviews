import { Button, ButtonGroup, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export const Header = () => {
  const { data: session, status } = useSession()
  console.log(session)
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
      <Link href="/">@app</Link>
      <ButtonGroup isAttached gap={2}>
        <ConnectButton />

        {status == "authenticated" ? (
          <Flex direction="column">
            <Text fontWeight="bold" fontSize="sm" title={session.user?.orcid}>
              {session?.user?.username}
            </Text>
            <Button onClick={() => signOut()} size="xs">
              sign out
            </Button>
          </Flex>
        ) : (
          <Button onClick={() => signIn()}>sign in with Orcid</Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}
