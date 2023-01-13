import { useState } from "react"

import { AntsReview, AntsReviewFactory, orchidAbi } from "@app/contracts"
import { useEffect } from "react"
import { useAccount, useNetwork, useSigner } from "wagmi"
import { Contract, ethers } from "ethers"

//mumbai orcid contract: 0x74a58601b3765516196EBF7db47A1959eD886097

const config: Record<string, { ocrid: string; antreview: string }> = {
  maticmum: {
    ocrid: "0x74a58601b3765516196EBF7db47A1959eD886097",
    antreview: "0xe0D404C22228b03D5b8a715Cb569C4944BC5A27A",
  },
  foundry: {
    ocrid: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    antreview: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
  },
}

export function useTokenContract() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: signer } = useSigner()

  const [contract, setContract] = useState<AntsReview>()
  const [orchidContract, setOrchidContract] = useState<Contract>()
  useEffect(() => {
    console.log(chain?.network)
    if (!isConnected || !chain?.network || !signer) return

    const antReviewAddress = config[chain.network].antreview
    if (!antReviewAddress) return

    setContract(AntsReviewFactory.connect(antReviewAddress, signer))

    const orcidContractAddress = config[chain.network].ocrid
    setOrchidContract(
      new ethers.Contract(orcidContractAddress, orchidAbi, signer)
    )
  }, [chain?.network, isConnected, signer])

  return { contract, orchidContract }
}
