import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// Screen coordinates measured from the supplied GLB, before its FBX axis transform.
const MODEL_SCALE = 0.052
const SCREEN = { center: [-23.1, 9.2, 28.6], width: 38.5, height: 33.2 }

function screenTexture(onUpdate) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 720
  const c = canvas.getContext('2d')
  let disposed = false
  const images = {}
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const rounded = (x, y, w, h, r, color) => {
    c.fillStyle = color
    c.beginPath()
    c.roundRect(x, y, w, h, r)
    c.fill()
  }
  const draw = () => {
    if (disposed) return
    c.fillStyle = '#69a2d2'
    c.fillRect(0, 0, 1024, 720)
    if (images.wallpaper) {
      const image = images.wallpaper
      const scale = Math.max(1024 / image.width, 720 / image.height)
      c.drawImage(
        image,
        (1024 - image.width * scale) / 2,
        (720 - image.height * scale) / 2,
        image.width * scale,
        image.height * scale,
      )
    }
    c.fillStyle = '#0b2e3c26'
    c.fillRect(0, 0, 1024, 720)
    c.fillStyle = '#354252'
    c.fillRect(0, 0, 1024, 37)
    c.fillStyle = '#ffffff'
    c.font = 'bold 15px monospace'
    c.fillText('Priyanshu OS', 24, 25)
    c.font = '12px monospace'
    c.fillText('A personal computer, in every sense.', 660, 25)
    const labels = ['Projects', 'Little Code', 'Little Terminal']
    labels.forEach((label, i) => {
      const y = 100 + i * 125
      if (i === 0) {
        rounded(37, y, 56, 46, 5, '#d29d43')
        rounded(34, y + 9, 62, 40, 5, '#efd08b')
        rounded(44, y + 18, 16, 23, 2, '#fff5d4')
        rounded(64, y + 15, 20, 27, 2, '#9db7b6')
      } else if (images[i === 1 ? 'code' : 'terminal']) {
        c.drawImage(images[i === 1 ? 'code' : 'terminal'], 34, y - 4, 62, 62)
      }
      c.shadowColor = '#183441'
      c.shadowBlur = 3
      c.fillStyle = '#ffffff'
      c.font = '15px monospace'
      c.textAlign = 'center'
      c.fillText(label, 65, y + 78)
      c.textAlign = 'left'
      c.shadowBlur = 0
    })
    c.shadowColor = '#0c2b354d'
    c.shadowBlur = 26
    rounded(217, 147, 726, 391, 5, '#35404d')
    rounded(220, 150, 720, 385, 3, '#ffffff')
    c.shadowBlur = 0
    c.save()
    c.beginPath()
    c.roundRect(220, 150, 720, 385, 3)
    c.clip()
    c.fillStyle = '#465363'
    c.fillRect(220, 150, 720, 40)
    c.restore()
    c.fillStyle = '#ffffff'
    c.font = '15px monospace'
    c.fillText('welcome.txt', 243, 176)
    rounded(908, 160, 20, 19, 2, '#dd5c3b')
    c.font = '17px monospace'
    c.fillText('×', 912, 176)
    c.fillStyle = '#899077'
    c.font = '12px monospace'
    c.fillText('NICE TO MEET YOU, CURIOUS HUMAN.', 264, 226)
    c.fillStyle = '#203b62'
    c.font = 'bold 42px Tahoma, sans-serif'
    c.fillText('Hey, I’m Priyanshu.', 264, 301)
    c.font = '32px Tahoma, sans-serif'
    c.fillStyle = '#53677e'
    c.fillText('Make yourself at home.', 264, 360)
    c.font = '16px monospace'
    c.fillStyle = '#6b775e'
    c.fillText('Projects, writing and a few things I’ve learned.', 264, 407)
    rounded(264, 444, 246, 48, 3, '#365f96')
    c.fillStyle = '#ffffff'
    c.font = 'bold 15px monospace'
    c.fillText('OPEN THE DESKTOP  →', 286, 475)
    c.fillStyle = '#344151'
    c.fillRect(0, 676, 1024, 44)
    rounded(8, 683, 115, 30, 7, '#398e32')
    c.fillStyle = '#eef1dc'
    c.font = 'bold italic 22px Tahoma, sans-serif'
    if (images.logo) c.drawImage(images.logo, 15, 685, 27, 25)
    c.fillText('start', 48, 705)
    c.fillStyle = '#ffffff'
    c.font = '13px monospace'
    c.fillText('welcome.txt', 160, 704)
    c.fillText('READY', 940, 704)
    c.fillStyle = '#0000000c'
    for (let y = 0; y < 676; y += 4) c.fillRect(0, y, 1024, 1)
    texture.needsUpdate = true
    onUpdate()
  }
  draw()
  document.fonts?.ready.then(draw)
  const loaders = []
  for (const [name, src] of Object.entries({
    wallpaper: '/computer/bliss.webp',
    code: '/computer/icons/little-code.png',
    terminal: '/computer/icons/little-terminal.png',
    logo: '/computer/os-logo.webp',
  })) {
    const image = new Image()
    image.onload = () => {
      if (!disposed) {
        images[name] = image
        draw()
      }
    }
    image.src = src
    loaders.push(image)
  }
  return {
    texture,
    dispose: () => {
      disposed = true
      loaders.forEach((image) => {
        image.onload = null
      })
      texture.dispose()
    },
  }
}

export default function ComputerScene({
  arriving = true,
  focused,
  reducedMotion = false,
  progress = 0,
  onEnter,
  onReady,
  onError,
  onProgress,
}) {
  const host = useRef(null)
  const state = useRef({
    arriving,
    focused,
    reducedMotion,
    progress,
    onEnter,
    onReady,
    onError,
    onProgress,
  })
  useEffect(() => {
    state.current = {
      arriving,
      focused,
      reducedMotion,
      progress,
      onEnter,
      onReady,
      onError,
      onProgress,
    }
  }, [
    arriving,
    focused,
    reducedMotion,
    progress,
    onEnter,
    onReady,
    onError,
    onProgress,
  ])

  useEffect(() => {
    const container = host.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch (error) {
      state.current.onError(error)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.94
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, 0.04)
    scene.environment = environment.texture
    room.dispose()
    pmrem.dispose()
    const ambient = new THREE.HemisphereLight('#fff4e3', '#77644b', 1.25)
    scene.add(ambient)
    const key = new THREE.DirectionalLight('#fff1df', 2.3)
    key.position.set(-3, 8, 5)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    Object.assign(key.shadow.camera, {
      left: -5,
      right: 5,
      top: 5,
      bottom: -5,
      near: 0.1,
      far: 20,
    })
    key.shadow.bias = -0.001
    key.shadow.normalBias = 0.02
    key.shadow.radius = 12
    key.shadow.blurSamples = 12
    scene.add(key)
    const fill = new THREE.DirectionalLight('#dce8ea', 0.8)
    fill.position.set(4, 3, -2)
    scene.add(fill)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.11 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.015
    floor.receiveShadow = true
    scene.add(floor)

    // Broad ambient contact shadows keep each piece grounded without a hard cut-out edge.
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = shadowCanvas.height = 128
    const shadowContext = shadowCanvas.getContext('2d')
    const gradient = shadowContext.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(49, 38, 26, 0.45)')
    gradient.addColorStop(0.4, 'rgba(49, 38, 26, 0.22)')
    gradient.addColorStop(1, 'rgba(49, 38, 26, 0)')
    shadowContext.fillStyle = gradient
    shadowContext.fillRect(0, 0, 128, 128)
    const contactTexture = new THREE.CanvasTexture(shadowCanvas)
    const contacts = [
      [-1.1, 0.35, 2.5, 1.5],
      [1.5, -0.65, 2.1, 2.9],
      [-0.8, 2.05, 3.5, 1.3],
      [1.2, 2, 0.8, 0.7],
    ].map(([x, z, w, h]) => {
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          map: contactTexture,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        }),
      )
      shadow.rotation.x = -Math.PI / 2
      shadow.position.set(x, -0.008, z)
      scene.add(shadow)
      return shadow
    })

    let disposed = false
    let needsRender = true
    let pendingReady = false
    let model
    let screen
    const screenCenter = new THREE.Vector3(-1.2, 1.3, 0.3)
    const normal = new THREE.Vector3(0.18, 0.08, 0.98).normalize()
    const display = screenTexture(() => {
      needsRender = true
    })
    const loader = new GLTFLoader()
    loader.load(
      '/retro_computer_setup_free.glb',
      (gltf) => {
        model = gltf.scene
        if (disposed) {
          disposeModel(model)
          return
        }
        model.updateMatrixWorld(true)
        const bounds = new THREE.Box3().setFromObject(model)
        const center = bounds.getCenter(new THREE.Vector3())
        model.scale.setScalar(MODEL_SCALE)
        model.position.set(
          -center.x * MODEL_SCALE,
          -bounds.min.y * MODEL_SCALE,
          -center.z * MODEL_SCALE,
        )
        model.traverse((object) => {
          if (object.isMesh) {
            object.castShadow = true
            object.receiveShadow = true
            object.material.envMapIntensity = 0.35
            object.material.color.multiply(new THREE.Color('#eee1cc'))
            object.material.roughness = Math.max(
              0.8,
              object.material.roughness || 0,
            )
          }
        })
        scene.add(model)
        screenCenter
          .set(
            (SCREEN.center[0] - center.x) * MODEL_SCALE,
            (SCREEN.center[2] - bounds.min.y) * MODEL_SCALE,
            (-SCREEN.center[1] - center.z) * MODEL_SCALE,
          )
          .addScaledVector(normal, 0.075)
        screen = new THREE.Mesh(
          new THREE.PlaneGeometry(
            SCREEN.width * MODEL_SCALE,
            SCREEN.height * MODEL_SCALE,
          ),
          new THREE.MeshBasicMaterial({
            map: display.texture,
            toneMapped: false,
          }),
        )
        screen.position.copy(screenCenter)
        screen.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
        scene.add(screen)
        needsRender = true
        pendingReady = true
        state.current.onProgress?.(
          92,
          'Lighting the scene and waking the monitor',
        )
      },
      (event) => {
        if (!disposed)
          state.current.onProgress?.(
            event.total ? Math.round((event.loaded / event.total) * 80) : 35,
            'Reading your retro computer model',
          )
      },
      (error) => {
        if (!disposed) state.current.onError(error)
      },
    )

    const pointer = new THREE.Vector2()
    const hover = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    let dragging = false
    let moved = false
    let startX = 0
    let orbit = 0
    let targetOrbit = 0
    let width = 1
    let height = 1
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const look = new THREE.Vector3(0, 1.15, 0)
    const desiredLook = new THREE.Vector3()
    const desiredCamera = new THREE.Vector3()
    const homeCamera = new THREE.Vector3()
    const homeLook = new THREE.Vector3()
    const screenCamera = new THREE.Vector3()
    const resize = () => {
      needsRender = true
      width = container.clientWidth
      height = container.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    const down = (event) => {
      dragging = true
      moved = false
      startX = event.clientX
    }
    const move = (event) => {
      if (dragging && !state.current.focused) {
        const delta = event.clientX - startX
        if (Math.abs(delta) > 5) moved = true
        targetOrbit = THREE.MathUtils.clamp(
          targetOrbit + delta * 0.002,
          -0.45,
          0.35,
        )
        startX = event.clientX
      }
      if (screen && !state.current.focused) {
        const box = container.getBoundingClientRect()
        pointer.set(
          ((event.clientX - box.left) / width) * 2 - 1,
          -((event.clientY - box.top) / height) * 2 + 1,
        )
        if (
          event.pointerType === 'mouse' &&
          !dragging &&
          !reduced.matches &&
          !state.current.reducedMotion
        )
          hover.copy(pointer)
        raycaster.setFromCamera(pointer, camera)
        renderer.domElement.style.cursor = raycaster.intersectObject(screen)
          .length
          ? 'pointer'
          : dragging
            ? 'grabbing'
            : 'grab'
      }
    }
    const up = () => {
      dragging = false
    }
    const cancel = () => {
      dragging = false
      moved = true
    }
    const leave = () => hover.set(0, 0)
    const click = (event) => {
      if (!screen || moved || state.current.focused) return
      const box = container.getBoundingClientRect()
      pointer.set(
        ((event.clientX - box.left) / width) * 2 - 1,
        -((event.clientY - box.top) / height) * 2 + 1,
      )
      raycaster.setFromCamera(pointer, camera)
      if (raycaster.intersectObject(screen).length) state.current.onEnter()
    }
    renderer.domElement.addEventListener('pointerdown', down)
    renderer.domElement.addEventListener('pointermove', move)
    renderer.domElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    renderer.domElement.addEventListener('click', click)
    const contextLost = (event) => {
      event.preventDefault()
      state.current.onError(new Error('WebGL context lost'))
    }
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    let previous = 0
    let first = true
    let arrivalBegan = null
    renderer.setAnimationLoop((time) => {
      if (document.hidden) return
      const dt = Math.min((time - previous) / 1000, 0.05)
      previous = time
      const motionReduced = reduced.matches || state.current.reducedMotion
      if (model && state.current.arriving && arrivalBegan === null)
        arrivalBegan = time
      const arrival =
        motionReduced || state.current.focused
          ? 1
          : arrivalBegan === null
            ? 0
            : Math.min(1, (time - arrivalBegan) / 2300)
      const entrance = Math.pow(1 - arrival, 3)
      const blend = first || motionReduced ? 1 : 1 - Math.exp(-dt * 5)
      orbit += (targetOrbit - orbit) * blend
      const narrow = width / height < 1
      const radius = narrow ? Math.max(12.8, 9.7 / camera.aspect) : 10.3
      const angle = 0.16 + orbit - entrance * 0.85
      homeCamera.set(
        Math.sin(angle) * radius,
        (narrow ? 4.5 : 3.65) + entrance * 4,
        Math.cos(angle) * radius,
      )
      if (!motionReduced) {
        homeCamera.x += hover.x * 0.18
        homeCamera.y += hover.y * 0.1
      }
      homeLook.set(narrow ? -0.15 : -0.55, narrow ? 0.95 : 0.85, 0)
      const distance =
        ((SCREEN.height * MODEL_SCALE) /
          2 /
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) *
        1.13
      screenCamera.copy(screenCenter).addScaledVector(normal, distance)
      const travel = motionReduced
        ? 0
        : state.current.focused
          ? 1
          : THREE.MathUtils.smoothstep(state.current.progress, 0, 1)
      desiredCamera.lerpVectors(homeCamera, screenCamera, travel)
      desiredLook.lerpVectors(homeLook, screenCenter, travel)
      if (
        !first &&
        !needsRender &&
        camera.position.distanceTo(desiredCamera) < 0.001 &&
        look.distanceTo(desiredLook) < 0.001 &&
        Math.abs(targetOrbit - orbit) < 0.001
      )
        return
      camera.position.lerp(desiredCamera, blend)
      look.lerp(desiredLook, blend)
      camera.lookAt(look)
      renderer.render(scene, camera)
      if (pendingReady) {
        pendingReady = false
        container.classList.add('computer-scene-ready')
        state.current.onReady()
      }
      needsRender = false
      first = false
    })

    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      renderer.domElement.removeEventListener('pointerdown', down)
      renderer.domElement.removeEventListener('pointermove', move)
      renderer.domElement.removeEventListener('pointerleave', leave)
      renderer.domElement.removeEventListener('click', click)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      renderer.setAnimationLoop(null)
      if (model) disposeModel(model)
      screen?.geometry.dispose()
      screen?.material.dispose()
      floor.geometry.dispose()
      floor.material.dispose()
      contacts.forEach((shadow) => {
        shadow.geometry.dispose()
        shadow.material.dispose()
      })
      contactTexture.dispose()
      display.dispose()
      environment.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      container.classList.remove('computer-scene-ready')
    }
  }, [])

  return (
    <div
      className="computer-canvas"
      ref={host}
      role="img"
      aria-label="Interactive retro computer. Drag to look around, or use Enter computer to explore."
    />
  )
}

function disposeModel(model) {
  model.traverse((object) => {
    if (!object.isMesh) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material]
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose()
      })
      material.dispose()
    })
  })
}
