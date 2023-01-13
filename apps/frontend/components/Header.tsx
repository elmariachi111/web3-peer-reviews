import { Button, ButtonGroup, Flex, Text } from "@chakra-ui/react"
import React from "react"
import "@rainbow-me/rainbowkit/styles.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { signIn, signOut, useSession } from "next-auth/react"

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
      <Text>@app</Text>
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
          <Button onClick={() => signIn()}>sign in with Ocrid</Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}
