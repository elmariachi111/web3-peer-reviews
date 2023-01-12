const sayHello = (): string => {
  return "Hello"
}

const aVeryLongFunction = (
  aLongVariableName: string,
  aLongVariableName2: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  aLongVariableName3: string
): string => {
  return "foo"
}

export { sayHello }
