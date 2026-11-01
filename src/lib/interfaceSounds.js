// Original, synthesized desktop sounds. No audio files or third-party samples.
let context
let master

function audio(volume) {
  const Audio = window.AudioContext || window.webkitAudioContext
  if (!Audio) return null
  if (!context) {
    context = new Audio()
    master = context.createGain()
    master.gain.setValueAtTime(volume, context.currentTime)
    master.connect(context.destination)
  }
  master.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), context.currentTime, 0.015)
  if (context.state === 'suspended') context.resume().catch(() => {})
  return context
}

export function silenceInterface() {
  if (context && master) master.gain.setTargetAtTime(0, context.currentTime, 0.02)
}

export function setInterfaceVolume(volume) {
  if (context && master)
    master.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), context.currentTime, 0.015)
}

export function playInterfaceSound(kind = 'click', volume = 0.3) {
  try {
    if (volume <= 0) {
      silenceInterface()
      return true
    }
    const ctx = audio(volume)
    if (!ctx) return false
    const now = ctx.currentTime + 0.01
    const tone = (frequency, start, duration, gain, type = 'sine') => {
      const oscillator = ctx.createOscillator()
      const envelope = ctx.createGain()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, now + start)
      envelope.gain.setValueAtTime(0.0001, now + start)
      envelope.gain.exponentialRampToValueAtTime(gain, now + start + 0.012)
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + start + duration)
      oscillator.connect(envelope)
      envelope.connect(master)
      oscillator.start(now + start)
      oscillator.stop(now + start + duration + 0.02)
      oscillator.onended = () => {
        oscillator.disconnect()
        envelope.disconnect()
      }
    }
    if (kind === 'startup') {
      ;[329.63, 493.88, 622.25, 739.99, 987.77].forEach((frequency, i) => {
        tone(frequency, i * 0.16, 1.65, 0.12)
        tone(frequency * 2, i * 0.16, 0.8, 0.025)
      })
    } else if (kind === 'open') {
      tone(587.33, 0, 0.13, 0.07)
      tone(880, 0.055, 0.18, 0.05)
    } else if (kind === 'close') {
      tone(622.25, 0, 0.12, 0.05)
      tone(415.3, 0.035, 0.13, 0.04)
    } else if (kind === 'notify') {
      tone(783.99, 0, 0.25, 0.06)
      tone(1174.66, 0.075, 0.3, 0.035)
    } else {
      tone(940, 0, 0.035, 0.035, 'triangle')
      tone(520, 0.008, 0.045, 0.025)
    }
    return true
  } catch {
    // Audio is an enhancement; unsupported/blocked output leaves the UI usable.
    return false
  }
}
