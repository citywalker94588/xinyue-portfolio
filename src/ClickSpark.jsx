import { useCallback, useEffect, useRef } from 'react'

export default function ClickSpark({ sparkColor = '#397ee8', sparkSize = 12, sparkRadius = 24, sparkCount = 8, duration = 400, easing = 'ease-out', extraScale = 1, ignoreSelector = '.close, .modalShade', children }) {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return undefined
    let resizeTimeout
    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(parent)
    resizeCanvas()
    return () => {
      observer.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [])

  const easeFunc = useCallback((progress) => {
    if (easing === 'linear') return progress
    if (easing === 'ease-in') return progress * progress
    if (easing === 'ease-in-out') return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
    return progress * (2 - progress)
  }, [easing])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined
    let animationId
    const draw = (timestamp) => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false
        const eased = easeFunc(elapsed / duration)
        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)
        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)
        context.strokeStyle = sparkColor
        context.lineWidth = 2
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
        return true
      })
      animationId = requestAnimationFrame(draw)
    }
    animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize])

  const handleClick = (event) => {
    const target = event.target
    if (target.closest('.close') || target.classList.contains('modalShade')) return
    if (ignoreSelector && target.closest(ignoreSelector) && !target.closest('.modal')) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const now = performance.now()
    sparksRef.current.push(...Array.from({ length: sparkCount }, (_, index) => ({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      angle: (2 * Math.PI * index) / sparkCount,
      startTime: now,
    })))
  }

  return <div className="clickSparkRoot" onClick={handleClick}><canvas ref={canvasRef} className="clickSparkCanvas" />{children}</div>
}
