import { useEffect, useState } from "react"
import { useTokenContract } from "./useTokenContract"

export const useApprover = (antid: string) => {
  const [approver, setApprover] = useState<string>()
  const { contract: antContract } = useTokenContract()

  useEffect(() => {
    if (!antContract) return
    antContract.getApprover(antid, 0).then(setApprover)
  }, [antContract, antid])

  return { approver }
}
