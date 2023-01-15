import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useCallback, useMemo, useState } from "react"
import { useAccount } from "wagmi"
import { useTokenContract } from "../../hooks/useTokenContract"

export const ContributeForm = (props: { antid: string }) => {
  const { antid } = props
  const { address } = useAccount()

  const { contract: antContract } = useTokenContract()

  const [amount, setAmount] = useState<string>("0")
  const toast = useToast()

  const weiAmount = useMemo(() => {
    if (!amount) return ""
    return ethers.utils.parseEther(amount).toString()
  }, [amount])

  const contribute = useCallback(async () => {
    if (!antContract) return

    await antContract.contribute(antid, { value: weiAmount })
    toast({
      title: "Your contribution has arrived",
      description: `You've just funded this peer review request with ${amount} MATIC`,
    })
  }, [amount, antContract, antid, toast, weiAmount])

  return (
    <Flex direction="row" gap={2}>
      <FormControl>
        <InputGroup>
          <Input
            value={amount}
            type="text"
            onChange={(e) => setAmount(e.target.value)}
          />
          <InputRightAddon>MATIC</InputRightAddon>
        </InputGroup>
        <FormHelperText>{weiAmount}</FormHelperText>
      </FormControl>
      <Button colorScheme="pink" disabled={!weiAmount} onClick={contribute}>
        contribute
      </Button>
    </Flex>
  )
}
