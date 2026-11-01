export function containTab(event, container) {
  if (event.key !== 'Tab' || !container) return
  const controls = [
    ...container.querySelectorAll(
      'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex="0"]',
    ),
  ].filter((el) => el.getClientRects().length)
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (!first) {
    event.preventDefault()
    container.focus()
    return
  }
  if (
    event.shiftKey &&
    (document.activeElement === first || !container.contains(document.activeElement))
  ) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
