'use client'

import React, { useRef, useImperativeHandle, forwardRef } from 'react'

interface ConfettiProps {}

export default forwardRef<{ trigger: () => void }, ConfettiProps>(function Confetti(props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useImperativeHandle(ref, () => ({
    trigger: () => {
      triggerConfetti()
    },
  }))

  const triggerConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.3,
          Math.random() * 8 - 4,
          Math.random() * 5 + 2
        )
      )
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.update()
        particle.draw(ctx)

        if (particle.alpha <= 0) {
          particles.splice(index, 1)
        }
      })

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        canvas.width = 0
        canvas.height = 0
      }
    }

    animate()
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  )
})

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number = 1
  size: number
  color: string
  rotation: number = 0
  rotationSpeed: number

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.size = Math.random() * 8 + 4
    this.rotationSpeed = Math.random() * 0.1 - 0.05

    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3']
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.2 // gravity
    this.alpha -= 0.015
    this.rotation += this.rotationSpeed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    ctx.restore()
  }
}
