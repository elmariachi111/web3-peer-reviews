import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useAccount } from "wagmi"

export const CommitmentForm = (props: { onSubmit: (data: any) => void }) => {
  const { address } = useAccount()

  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm({
    defaultValues: {
      privateAddress: address,
      anonAddress: "",
    },
    mode: "all",
  })
  const watchFields = watch(["privateAddress", "anonAddress"])
  const canSubmit = useMemo(() => {
    return address !== watchFields[0] && address === watchFields[1]
  }, [watchFields, address])

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(props.onSubmit)}
      direction="column"
      gap={2}
    >
      <FormControl>
        <FormLabel>Private Address</FormLabel>
        <FormHelperText>
          must be associated with an Orcid, not going to be disclosed
        </FormHelperText>
        <Input
          {...register("privateAddress", {
            required: true,
            minLength: 40,
          })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Public Peer Reviewer Address</FormLabel>
        <FormHelperText>this is public</FormHelperText>
        <Input
          {...register("anonAddress", {
            required: true,
            minLength: 40,
          })}
        />
      </FormControl>
      <Button type="submit" disabled={!isValid || !canSubmit}>
        Hash & Sign
      </Button>
    </Flex>
  )
}
