/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useEffect, useMemo, useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { useOrcidMap } from "../../hooks/useOrcidMap"
import { SignedCommitment } from "../../types"

const SignControl = (props: {
  addressToSign: string
  signature?: string
  onSigned: (signature: string) => void
}) => {
  const { address } = useAccount()

  const { signMessageAsync } = useSignMessage()

  const { addressToSign, signature, onSigned } = props

  const [signedBy, setSignedBy] = useState<string>()
  useEffect(() => {
    if (!addressToSign || !signature) return
    setSignedBy(ethers.utils.verifyMessage(addressToSign, signature))
  }, [addressToSign, signature])
  return (
    <FormControl alignContent="center">
      {signature ? (
        <Alert status="success">
          <AlertIcon />
          address signed {signedBy && `by ${signedBy}`}
        </Alert>
      ) : address === addressToSign ? (
        <Text>switch to the other account</Text>
      ) : (
        <Button
          onClick={() => {
            signMessageAsync({ message: addressToSign }).then(onSigned)
          }}
        >
          sign this address
        </Button>
      )}
    </FormControl>
  )
}

export const CommitmentForm = (props: {
  onSubmit: (data: SignedCommitment) => void
}) => {
  const { address } = useAccount()

  const [privateAddress, setPrivateAddress] = useState<string | undefined>(
    address
  )

  const [signedPrivateAddress, setSignedPrivateAddress] = useState<string>()

  const [anonAddress, setAnonAddress] = useState<string>()
  const [signedAnonAddress, setSignedAnonAddress] = useState<string>()

  const [reviewUrl, setReviewUrl] = useState<string>("")

  const { orcid: privateAddressOrcid } = useOrcidMap(privateAddress)

  const canBeSubmitted = useMemo(() => {
    if (!privateAddress || !anonAddress) return false
    if (privateAddress.length < 40 || anonAddress.length < 40) return false
    if (!signedPrivateAddress || !signedAnonAddress) return false

    if (!privateAddressOrcid) return false

    const privateAddressSigner = ethers.utils.verifyMessage(
      privateAddress,
      signedPrivateAddress
    )
    if (privateAddressSigner !== anonAddress) return false

    const anonAddressSigner = ethers.utils.verifyMessage(
      anonAddress,
      signedAnonAddress
    )
    if (!reviewUrl) return false

    if (anonAddressSigner !== privateAddress) return false

    return true
  }, [
    privateAddress,
    privateAddressOrcid,
    anonAddress,
    signedPrivateAddress,
    signedAnonAddress,
    reviewUrl,
  ])

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" align="flex-end" gap={2}>
        <FormControl>
          <FormLabel>Private Address</FormLabel>
          <FormHelperText>
            {privateAddressOrcid ? (
              <Text color="green.400">{privateAddressOrcid}</Text>
            ) : (
              <Text>
                must be associated with an Orcid, not going to be disclosed
              </Text>
            )}
          </FormHelperText>
          <Input
            type="text"
            value={privateAddress}
            defaultValue={address}
            onChange={(e) => setPrivateAddress(e.target.value)}
          />
        </FormControl>
        {privateAddress && (
          <SignControl
            addressToSign={privateAddress}
            onSigned={setSignedPrivateAddress}
            signature={signedPrivateAddress}
          />
        )}
      </Flex>

      <Flex direction="row" align="flex-end" gap={2}>
        <FormControl>
          <FormLabel>Public Peer Reviewer Address</FormLabel>
          <FormHelperText>this is public</FormHelperText>
          <Input
            type="text"
            value={anonAddress}
            onChange={(e) => setAnonAddress(e.target.value)}
          />
        </FormControl>
        {anonAddress && (
          <SignControl
            addressToSign={anonAddress}
            onSigned={setSignedAnonAddress}
            signature={signedAnonAddress}
          />
        )}
      </Flex>

      <FormControl>
        <FormLabel>provide a link to your peer review</FormLabel>
        <FormHelperText>
          In reality this would be more IPFS content
        </FormHelperText>
        <Input
          type="text"
          value={reviewUrl}
          onChange={(e) => setReviewUrl(e.target.value)}
        ></Input>
      </FormControl>

      <Button
        type="submit"
        disabled={!canBeSubmitted}
        onClick={() =>
          props.onSubmit({
            privateAddress: privateAddress!,
            signedPrivateAddress: signedPrivateAddress!,
            anonAddress: anonAddress!,
            signedAnonAddress: signedAnonAddress!,
            reviewUrl,
          })
        }
      >
        Create Commitment
      </Button>
    </Flex>
  )
}
