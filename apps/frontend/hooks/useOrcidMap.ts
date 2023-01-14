import { useEffect, useState } from "react"
import { useTokenContract } from "./useTokenContract"

export const useOrcidMap = (address?: string) => {
  const { orchidContract } = useTokenContract()
  const [mappedOrcid, setMappedOrcid] = useState<string>()

  useEffect(() => {
    if (!orchidContract || !address) return
    ;(async () => {
      setMappedOrcid(await orchidContract.addressToOrcid(address))
    })()
  }, [address, orchidContract])

  return { orcid: mappedOrcid }
}
