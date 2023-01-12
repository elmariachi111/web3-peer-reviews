import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import "@rainbow-me/rainbowkit/styles.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const Header = () => {
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
      <ConnectButton />
    </Flex>
  )
}
