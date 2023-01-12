import { sayHello } from "@app/core"
import { TokenFactory } from "@app/contracts"
import { ethers } from "ethers"

const main = async () => {
  const result = sayHello()
  console.log(result)

  const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
  const Token = TokenFactory.connect(address, provider)
  const tokenName = await Token.name()
  console.log(tokenName)
}

main()
