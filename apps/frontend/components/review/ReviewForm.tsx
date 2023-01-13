import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react"
import { ChangeEvent, useCallback, useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { useAccount } from "wagmi"
//import ReactDatePicker from "react-datepicker"
import { SingleDatepicker } from "chakra-dayzed-datepicker"
import { Web3Storage } from "web3.storage"

export const ReviewForm = () => {
  const { address } = useAccount()

  const uploadFile = useCallback(async (file: File) => {
    const w3sClient = new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3_AUTH_APIKEY as string,
    })
    const rootCid = await w3sClient.put([file], {
      wrapWithDirectory: false,
    })
    return rootCid
  }, [])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues: {
      issuer: address,
      paperCid: "",
      deadline: new Date(),
    },
  })

  useEffect(() => {
    setValue("issuer", address)
  }, [address, setValue])

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <Heading>File a paper for review</Heading>
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        direction="column"
        gap={2}
      >
        <FormControl>
          <FormLabel>Author (Issuer)</FormLabel>
          <Input {...register("issuer")} disabled />
        </FormControl>

        <Flex gap={2}>
          <FormControl>
            <FormLabel htmlFor="paperCid">Paper CID</FormLabel>
            <Input {...register("paperCid")} defaultValue="Qm" />
          </FormControl>

          <Flex onClick={() => inputRef.current?.click()} alignItems="flex-end">
            <input
              onChange={async (value: ChangeEvent<HTMLInputElement>) => {
                const file = value.target.files?.[0]
                if (!file) return

                const cid = await uploadFile(file)
                setValue("paperCid", cid)
              }}
              type="file"
              ref={inputRef}
              hidden
            />
            <Button isLoading={false}>Upload</Button>
          </Flex>
        </Flex>
        <FormControl>
          <FormLabel>Deadline</FormLabel>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <SingleDatepicker
                name="date-input"
                date={field.value}
                onDateChange={field.onChange}
              />
            )}
          />
        </FormControl>
        <Button type="submit">Submit</Button>
      </Flex>
    </>
  )
}
