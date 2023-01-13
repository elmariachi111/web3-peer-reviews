import { useState } from "react"

import { AntsReview, AntsReviewFactory } from "@app/contracts"
import { useEffect } from "react"
import { useAccount, useNetwork, useSigner } from "wagmi"

//mumbai orcid contract: 0x74a58601b3765516196EBF7db47A1959eD886097

const config: Record<string, { ocrid: string; antreview: string }> = {
  maticmum: {
    ocrid: "0x74a58601b3765516196EBF7db47A1959eD886097",
    antreview: "0xe0D404C22228b03D5b8a715Cb569C4944BC5A27A",
  },
  foundry: {
    ocrid: "0x",
    antreview: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  },
}

export function useTokenContract() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: signer } = useSigner()

  const [contract, setContract] = useState<AntsReview>()
  useEffect(() => {
    console.log(chain?.network)
    if (!isConnected || !chain?.network || !signer) return

    const antReviewAddress = config[chain.network]?.antreview
    if (!antReviewAddress) return

    setContract(AntsReviewFactory.connect(antReviewAddress, signer))
  }, [chain?.network, isConnected, signer])

  return { contract }
}
