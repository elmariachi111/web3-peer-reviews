import { useState } from "react"

import { Token, TokenFactory } from "@app/contracts"
import { useEffect } from "react"
import { useAccount, useNetwork, useSigner } from "wagmi"

const config: Record<string, { address: string }> = {
  foundry: {
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  },
}

export function useTokenContract() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: signer } = useSigner()

  const [contract, setContract] = useState<Token>()
  useEffect(() => {
    if (!isConnected || !chain?.network || !signer) return

    const contractAddress = config[chain.network]?.address
    if (!contractAddress) return

    setContract(TokenFactory.connect(contractAddress, signer))
  }, [chain?.network, isConnected, signer])

  return { contract }
}
