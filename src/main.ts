export default function() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('ok')
      resolve()
    }, 1000)
  })
}
