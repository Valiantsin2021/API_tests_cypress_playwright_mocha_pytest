import { exec } from 'child_process'
console.time('mocha')
exec('npm run mocha', (error, stdout, stderr) => {
  console.timeEnd('mocha')
  console.log(stdout)
  console.error(stderr)
  if (error) {
    console.error(error)
    process.exit(1)
  }
})
console.time('cypress')
exec('npm run cy:parallel', (error, stdout, stderr) => {
  console.timeEnd('cypress')
  console.log(stdout)
  console.error(stderr)
  if (error) {
    console.error(error)
    process.exit(1)
  }
})
console.time('playwright')
exec('npm run playwright', (error, stdout, stderr) => {
  console.timeEnd('playwright')
  console.log(stdout)
  console.error(stderr)
  if (error) {
    console.error(error)
    process.exit(1)
  }
})
