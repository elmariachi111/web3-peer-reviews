import { useState } from "react"

import { AntsReview, AntsReviewFactory, orchidAbi } from "@app/contracts"
import { Contract, ethers } from "ethers"
import { useEffect } from "react"
import { useAccount, useNetwork, useSigner } from "wagmi"

//mumbai orcid contract: 0x74a58601b3765516196EBF7db47A1959eD886097

type ChainLocation = {
  address: string
  block: number
}

export const contractConfig: Record<
  string,
  { orcid: ChainLocation; antreview: ChainLocation }
> = {
  maticmum: {
    orcid: {
      address: "0x74a58601b3765516196EBF7db47A1959eD886097",
      block: 28464119,
    },
    antreview: {
      address: "0x36d304993cb1575a2f9b8a0388b18aa5ec6d7a61",
      block: 30937792,
    },
  },
  foundry: {
    orcid: { address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", block: 0 },
    antreview: {
      address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
      block: 0,
    },
  },
}

export function useTokenContract() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: signer } = useSigner()

  const [contract, setContract] = useState<AntsReview>()
  const [orchidContract, setOrchidContract] = useState<Contract>()
  const [chainConfig, setChainConfig] = useState<{
    orcid: ChainLocation
    antreview: ChainLocation
  }>()

  useEffect(() => {
    if (!isConnected || !chain?.network || !signer) return

    const antReviewAddress = contractConfig[chain.network].antreview.address
    if (!antReviewAddress) return

    setContract(AntsReviewFactory.connect(antReviewAddress, signer))

    const orcidContractAddress = contractConfig[chain.network].orcid.address
    setOrchidContract(
      new ethers.Contract(orcidContractAddress, orchidAbi, signer)
    )
    setChainConfig(contractConfig[chain.network])
  }, [chain?.network, isConnected, signer])

  return { contract, orchidContract, chainConfig }
}
