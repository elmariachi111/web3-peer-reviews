import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
} from "@chakra-ui/react"
import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react"
import { ChangeEvent, useCallback, useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { useAccount } from "wagmi"
//import ReactDatePicker from "react-datepicker"
import { SingleDatepicker } from "chakra-dayzed-datepicker"
import { Web3Storage } from "web3.storage"

export const ReviewDashboard = () => {
  const { address } = useAccount()

  return (
    <>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <Card>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </>
  )
}
