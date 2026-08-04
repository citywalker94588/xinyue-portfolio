import { useEffect, useRef } from 'react'

const colorToRgb = (value) => {
  const normalized = value.replace('#', '')
  const integer = Number.parseInt(normalized.length === 3 ? normalized.split('').map((part) => part + part).join('') : normalized, 16)
  return { red: (integer >> 16) & 255, green: (integer >> 8) & 255, blue: integer & 255 }
}

const tint = ({ red, green, blue }, amount) => ({
  red: Math.round(red + (255 - red) * amount),
  green: Math.round(green + (255 - green) * amount),
  blue: Math.round(blue + (255 - blue) * amount),
})

export default function BallpitFallback({
  count = 100,
  gravity = 0.01,
  friction = 0.9975,
  wallBounce = 0.95,
  followCursor = false,
  colors = ['#4e9dff', '#004dff', '#d7d7d7', '#ede8b5'],
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const parent = canvas?.parentElement
    if (!canvas || !context || !parent) return undefined

    let frameId
    let width = 0
    let height = 0
    let previousTime = 0
    let devicePixelRatio = 1
    const pointer = { x: -9999, y: -9999, active: false }
    const balls = []
    const palette = colors.map(colorToRgb)

    const createBall = (index) => {
      const radius = 11 + Math.random() * 25
      return {
        radius,
        x: radius + Math.random() * Math.max(1, width - radius * 2),
        y: radius + Math.random() * Math.max(1, height - radius * 2),
        velocityX: (Math.random() - 0.5) * 1.05,
        velocityY: (Math.random() - 0.5) * 0.8,
        color: palette[index % palette.length],
      }
    }

    const resize = () => {
      const bounds = parent.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * devicePixelRatio)
      canvas.height = Math.round(height * devicePixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      balls.length = 0
      const visualCount = Math.max(36, Math.min(count, Math.round(width / 10)))
      for (let index = 0; index < visualCount; index += 1) balls.push(createBall(index))
    }

    const updatePointer = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active = true
    }

    const resolveCollisions = () => {
      for (let firstIndex = 0; firstIndex < balls.length; firstIndex += 1) {
        const first = balls[firstIndex]
        for (let secondIndex = firstIndex + 1; secondIndex < balls.length; secondIndex += 1) {
          const second = balls[secondIndex]
          const deltaX = second.x - first.x
          const deltaY = second.y - first.y
          const distance = Math.hypot(deltaX, deltaY) || 1
          const minimumDistance = first.radius + second.radius
          if (distance >= minimumDistance) continue
          const normalX = deltaX / distance
          const normalY = deltaY / distance
          const overlap = (minimumDistance - distance) * 0.5
          first.x -= normalX * overlap
          first.y -= normalY * overlap
          second.x += normalX * overlap
          second.y += normalY * overlap
          const relativeVelocity = (second.velocityX - first.velocityX) * normalX + (second.velocityY - first.velocityY) * normalY
          if (relativeVelocity >= 0) continue
          const impulse = relativeVelocity * 0.92
          first.velocityX += impulse * normalX
          first.velocityY += impulse * normalY
          second.velocityX -= impulse * normalX
          second.velocityY -= impulse * normalY
        }
      }
    }

    const drawBall = (ball) => {
      const { red, green, blue } = ball.color
      const light = tint(ball.color, 0.68)
      const idleLight = { x: width * 0.36, y: height * 0.18 }
      const lightSource = pointer.active ? pointer : idleLight
      const lightDeltaX = lightSource.x - ball.x
      const lightDeltaY = lightSource.y - ball.y
      const lightDistance = Math.hypot(lightDeltaX, lightDeltaY) || 1
      const lightX = lightDeltaX / lightDistance
      const lightY = lightDeltaY / lightDistance
      const highlightX = ball.x + lightX * ball.radius * 0.38
      const highlightY = ball.y + lightY * ball.radius * 0.38

      const sphere = context.createRadialGradient(highlightX, highlightY, ball.radius * 0.02, ball.x, ball.y, ball.radius * 1.08)
      sphere.addColorStop(0, 'rgba(255, 255, 255, 1)')
      sphere.addColorStop(0.13, `rgba(${light.red}, ${light.green}, ${light.blue}, 0.96)`)
      sphere.addColorStop(0.46, `rgb(${red}, ${green}, ${blue})`)
      sphere.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0.76)`)
      context.fillStyle = sphere
      context.beginPath()
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      context.fill()
      context.strokeStyle = 'rgba(255, 255, 255, 0.62)'
      context.lineWidth = 1
      context.stroke()
    }

    const render = (time) => {
      const delta = Math.min(2, previousTime ? (time - previousTime) / 16.67 : 1)
      previousTime = time
      context.clearRect(0, 0, width, height)
      for (const ball of balls) {
        if (followCursor && pointer.active) {
          const deltaX = ball.x - pointer.x
          const deltaY = ball.y - pointer.y
          const distance = Math.hypot(deltaX, deltaY) || 1
          const reach = ball.radius * 4.8 + 96
          if (distance < reach) {
            const force = (1 - distance / reach) * 0.88
            ball.velocityX += (deltaX / distance) * force * delta
            ball.velocityY += (deltaY / distance) * force * delta
          }
        }
        ball.velocityY += gravity * delta
        ball.velocityX *= friction
        ball.velocityY *= friction
        ball.x += ball.velocityX * delta
        ball.y += ball.velocityY * delta
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
          ball.x = Math.max(ball.radius, Math.min(width - ball.radius, ball.x))
          ball.velocityX *= -wallBounce
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
          ball.y = Math.max(ball.radius, Math.min(height - ball.radius, ball.y))
          ball.velocityY *= -wallBounce
        }
      }
      resolveCollisions()
      balls.sort((first, second) => first.y - second.y).forEach(drawBall)
      frameId = requestAnimationFrame(render)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    canvas.addEventListener('pointermove', updatePointer)
    canvas.addEventListener('pointerleave', () => { pointer.active = false })
    resize()
    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      canvas.removeEventListener('pointermove', updatePointer)
      canvas.removeEventListener('pointerleave', () => { pointer.active = false })
    }
  }, [count, colors, followCursor, friction, gravity, wallBounce])

  return <canvas ref={canvasRef} className="ballpitFallbackCanvas" aria-label="互动小球" />
}