import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useApprover } from "../../../hooks/useApprover"
import { useOrcidMap } from "../../../hooks/useOrcidMap"
import { useTokenContract } from "../../../hooks/useTokenContract"
import { SignedCommitment } from "../../../types"
import NextLink from "next/link"
import { useAccount } from "wagmi"
type PeerReview = {
  accepted: boolean
  peer_reviewer: string
  reviewHash: string
  orcidProof: string
}

const VerifyPeerReviewer = (props: {
  peerReview: PeerReview
  onValidate?: (valid: boolean) => void
}) => {
  const { peerReview, onValidate } = props

  const [privateOrcid, setPrivateOrcid] = useState<string>()

  const { orchidContract } = useTokenContract()

  const [proofString, setProofString] = useState<string>("")
  const [proof, setProof] = useState<{
    proof?: SignedCommitment
    validation: {
      json?: boolean | string
      hash?: boolean | string
      privateSig?: boolean | string
      anonSig?: boolean | string
    }
  }>()

  const allTrue = (o: any) => {
    if (!o) return undefined
    return Object.values(o).filter((v) => v !== true).length === 0
  }

  const isProofValid = useMemo(() => {
    if (!proof?.validation) return
    return allTrue(proof.validation)
  }, [proof])

  const validateHash = (proof: SignedCommitment) => {
    const conc = ethers.utils.hexConcat([
      proof.privateAddress,
      proof.signedPrivateAddress,
      proof.anonAddress,
      proof.signedAnonAddress,
    ])
    const hash = ethers.utils.keccak256(conc)
    return hash === peerReview.orcidProof || "proof hash is invalid"
  }

  const validatePrivateAddressSig = (proof: SignedCommitment) => {
    return (
      proof.anonAddress ===
        ethers.utils.verifyMessage(
          proof.privateAddress,
          proof.signedPrivateAddress
        ) || "signature over private address is invalid"
    )
  }

  const validateAnonAddressSig = (proof: SignedCommitment) => {
    return (
      proof.privateAddress ===
        ethers.utils.verifyMessage(
          proof.anonAddress,
          proof.signedAnonAddress
        ) || "signature over anon address is invalid"
    )
  }

  const validate = (proofString: string) => {
    let proof: SignedCommitment
    try {
      proof = JSON.parse(proofString)
    } catch (e: any) {
      setProof({
        proof: undefined,
        validation: {
          json: "can't parse json",
        },
      })
      return
    }
    const _validation = {
      json: true,
      anonSig: validateAnonAddressSig(proof),
      privateSig: validatePrivateAddressSig(proof),
      hash: validateHash(proof),
    }

    setProof({
      proof,
      validation: _validation,
    })
  }

  useEffect(() => {
    if (!proof || !allTrue(proof.validation) || !orchidContract) return
    const { proof: _proof } = proof
    if (!_proof) return
    ;(async () => {
      setPrivateOrcid(
        await orchidContract.addressToOrcid(_proof.privateAddress)
      )
    })()
  }, [orchidContract, proof])

  return (
    <Flex direction="column" gap={2}>
      <Heading size="md" mt={4}>
        {" "}
        Verify reviewer{" "}
      </Heading>

      <FormControl>
        <FormLabel>paste signed proof here</FormLabel>
        <Textarea
          rows={7}
          onChange={(e) => setProofString(e.target.value)}
        ></Textarea>
      </FormControl>
      <Button onClick={() => validate(proofString)}>verify</Button>
      {proof?.proof && (
        <Flex direction="column">
          <Alert status={isProofValid ? "success" : "error"}>
            <AlertIcon />
            <AlertTitle>
              {isProofValid ? "The proof is valid" : "The proof is not valid"}
            </AlertTitle>
          </Alert>
          {privateOrcid ? (
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>
                The reviewer&apos;s private account has an attached ORCID
              </AlertTitle>
              <AlertDescription>
                Check out their{" "}
                <Link href={`https://orcid.org/${privateOrcid}`}>
                  {" "}
                  ORCID profile
                </Link>
                .
              </AlertDescription>
            </Alert>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>
                The reviewer&apos;s private account is not attached to an ORCID
              </AlertTitle>
              <AlertDescription>
                the private account address is: {proof.proof.privateAddress}
              </AlertDescription>
            </Alert>
          )}
        </Flex>
      )}
    </Flex>
  )
}
export default function Approve() {
  const { query } = useRouter()
  const { antid, reviewId } = query
  const { address } = useAccount()

  const { contract: reviewContract } = useTokenContract()

  const { approver } = useApprover(antid as string)
  const [peerReview, setPeerReview] = useState<PeerReview>()

  const toast = useToast()

  useEffect(() => {
    if (!reviewContract) return
    ;(async () => {
      const _peerReview = await reviewContract.peer_reviews(
        antid as string,
        reviewId as string
      )
      setPeerReview(_peerReview)
    })()
  }, [antid, reviewContract, reviewId])

  const approveReview = useCallback(
    async (antid: string, reviewId: string) => {
      if (!reviewContract) return
      const result = await reviewContract.acceptAntReview(antid, reviewId, 0)
      console.log(result)
      toast({
        status: "success",
        title: "peer review approved",
      })
    },
    [reviewContract, toast]
  )

  return (
    <Flex direction="column">
      <Breadcrumb fontSize="sm" color="gray.500" my={8} separator=">">
        <BreadcrumbItem>
          <NextLink href={`/review/${antid}`} passHref>
            <BreadcrumbLink>Review Request {antid}</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <NextLink href={`/review/${antid}/${reviewId}`} passHref>
            <BreadcrumbLink>Peer Review {reviewId}</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading mb={4}>
        Approve Peer Review {antid}/{reviewId}
      </Heading>
      {!peerReview ? (
        "connect your wallet"
      ) : (
        <Flex direction="column" w="full">
          <Flex direction="row" w="100%" align="center" justify="space-between">
            <Flex direction="column" gap={4}>
              <Text>Submitted by {peerReview.peer_reviewer} </Text>
              <Text>
                Peer Review:{" "}
                <Link href={peerReview.reviewHash} isExternal>
                  {peerReview.reviewHash}
                </Link>
              </Text>
            </Flex>
            <Button
              colorScheme="pink"
              disabled={approver?.toLowerCase() != address?.toLowerCase()}
              onClick={() => approveReview(antid as string, reviewId as string)}
            >
              Approve
            </Button>
          </Flex>
          <VerifyPeerReviewer peerReview={peerReview} />
        </Flex>
      )}
    </Flex>
  )
}
