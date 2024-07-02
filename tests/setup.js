import fs from 'fs'
import { UserBuilder } from '../utils/dataFactory.js'

function createDefaultUsers(numberOfUsers) {
  return Array.from({ length: numberOfUsers }, () => new UserBuilder().setDefaults().build())
}

export default function seed() {
  const users = createDefaultUsers(10)
  fs.writeFileSync('./fixtures/users.json', JSON.stringify(users, null, 2))
  const contact1 = createDefaultUsers(10)
  fs.writeFileSync('./fixtures/contact1.json', JSON.stringify(contact1, null, 2))
  const contact2 = createDefaultUsers(10)
  fs.writeFileSync('./fixtures/contact2.json', JSON.stringify(contact2, null, 2))
}
seed()