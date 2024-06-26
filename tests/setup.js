import fs from 'fs'
import { UserBuilder } from '../utils/dataFactory.js'

export default function seed() {
  const users = [
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build()
  ]
  fs.writeFileSync('./fixtures/users.json', JSON.stringify(users, null, 2))
  const contact1 = [
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build()
  ]
  fs.writeFileSync('./fixtures/contact1.json', JSON.stringify(contact1, null, 2))
  const contact2 = [
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build(),
    new UserBuilder().setDefaults().build()
  ]
  fs.writeFileSync('./fixtures/contact2.json', JSON.stringify(contact2, null, 2))
}
seed()