import { List, ListItem } from "@chakra-ui/react"
import Link from "next/link"

export default function Home() {
  return (
    <List>
      <ListItem>
        <Link href="/issue">Issue a new peer review request</Link>
      </ListItem>
      <ListItem>
        <Link href="/requests">All open requests</Link>
      </ListItem>
    </List>
  )
}
