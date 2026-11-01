import test from 'node:test'
import assert from 'node:assert/strict'
import { playInterfaceSound, silenceInterface, setInterfaceVolume } from '../src/lib/interfaceSounds.js'

test('unsupported audio output is a safe enhancement failure', () => {
  globalThis.window = {}
  assert.equal(playInterfaceSound('startup'), false)
})

test('zero volume schedules no audio, and active output obeys volume and mute controls', () => {
  const gainChanges = []
  let oscillators = 0
  const parameter = () => ({ setValueAtTime(value) { gainChanges.push(value) }, setTargetAtTime(value) { gainChanges.push(value) }, exponentialRampToValueAtTime() {} })
  globalThis.window = { AudioContext: class {
    currentTime = 0
    state = 'running'
    destination = {}
    createGain() { return { gain: parameter(), connect() {}, disconnect() {} } }
    createOscillator() { oscillators++; return { frequency: parameter(), connect() {}, disconnect() {}, start() {}, stop() {} } }
  } }
  assert.equal(playInterfaceSound('click', 0), true)
  assert.equal(oscillators, 0)
  assert.equal(playInterfaceSound('startup', 0.3), true)
  assert.ok(oscillators > 0)
  setInterfaceVolume(0.15)
  assert.equal(gainChanges.at(-1), 0.15)
  silenceInterface()
  assert.equal(gainChanges.at(-1), 0)
  delete globalThis.window
})
