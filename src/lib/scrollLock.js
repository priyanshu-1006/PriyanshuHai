// Shared by the computer and modal controls so closing one cannot unlock another.
let owners = 0
let previous = ''
export function lockBodyScroll() {
  if (owners === 0) previous = document.body.style.overflow
  owners += 1
  document.body.style.overflow = 'hidden'
  let released = false
  return () => {
    if (released) return
    released = true
    owners = Math.max(0, owners - 1)
    if (owners === 0) document.body.style.overflow = previous
  }
}
