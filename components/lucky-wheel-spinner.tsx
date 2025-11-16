'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import Confetti from '@/components/confetti'

const LUCKY_WISHES = [
  '✨ Cô/Thầy là ngọn đèn sáng trên con đường học tập của chúng em',
  '🌟 Cảm ơn cô/thầy vì tâm huyết và yêu thương dành cho học sinh',
  '💝 Chúc cô/thầy luôn mạnh khỏe và hạnh phúc bên gia đình',
  '🎓 Cô/Thầy là công nhân tâm huyết của tương lai đất nước',
  '🌸 Hãy cứ bớt lo lắng, chúng em sẽ cố gắng hết sức',
  '💪 Cô/Thầy là người hùng trong tim mỗi học sinh',
  '✨ Cảm ơn vì mỗi ngày bạn dạy chúng em là một bài học xương máu',
  '🎯 Chúc cô/thầy sức khỏe dồi dào trong năm học mới',
  '❤️ Yêu cô/thầy vì tất cả những điều tuyệt vời cô/thầy đã làm',
  '🌈 Cô/Thầy là niên một khó quên trong trái tim chúng em',
  '📚 Cảm ơn cô/thầy vì đã giúp chúng em trưởng thành',
  '✨ Cô/Thầy xứng đáng được yêu quý nhất',
  '🎊 Chúc cô/thầy mỗi ngày đều tràn đầy niềm vui',
  '💫 Cô/Thầy là ngôi sao hướng dẫn con đường của chúng em',
  '🙏 Tạ ơn vì sự hy sinh và tình yêu thương thương hiền của cô/thầy',
]

export default function LuckyWheelSpinner() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedWish, setSelectedWish] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const confettiRef = useRef<{ trigger: () => void } | null>(null)

  // Create audio context for spinning sound
  useEffect(() => {
    if (audioRef.current === null) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==')
    }
  }, [])

  const playTingSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const handleSpin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedWish(null)

    // Random rotation: between 1800 to 3600 degrees (5-10 full rotations)
    const randomWishIndex = Math.floor(Math.random() * LUCKY_WISHES.length)
    const degreesPerWish = 360 / LUCKY_WISHES.length
    const targetRotation = Math.random() * 360 + 360 * 8

    // Animate the spin
    const startTime = Date.now()
    const duration = 2000 // 2 seconds

    playTingSound()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentRotation = targetRotation * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setSelectedWish(LUCKY_WISHES[randomWishIndex])
        setIsSpinning(false)
        confettiRef.current?.trigger()
      }
    }

    animate()
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl">
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
          🎁 LUCKY WISHES
        </h1>
        <p className="text-lg text-white/90 drop-shadow">
          Quay để nhận lời chúc bất ngờ
        </p>
      </div>

      {/* Spinning Wheel Container */}
      <div className="relative w-full max-w-sm aspect-square">
        {/* Spinning Wheel */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '0ms' : '0ms',
          }}
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer circle */}
            <circle cx="200" cy="200" r="190" fill="none" stroke="#fff" strokeWidth="8" />

            {/* Wheel segments */}
            {LUCKY_WISHES.map((_, index) => {
              const angle = (360 / LUCKY_WISHES.length) * index
              const colors = [
                '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
                '#AA96DA', '#FCBAD3', '#A8D8EA', '#AA96DA', '#FFD3B6',
                '#FFAAA5', '#FF8B94', '#A8E6CF', '#FFD3B6', '#FFAAA5'
              ]
              const color = colors[index % colors.length]

              return (
                <g key={index}>
                  {/* Segment */}
                  <path
                    d={`M 200,200 L ${200 + 180 * Math.cos((angle - 90) * Math.PI / 180)},${200 + 180 * Math.sin((angle - 90) * Math.PI / 180)} A 180,180 0 0,1 ${200 + 180 * Math.cos((angle + 360 / LUCKY_WISHES.length - 90) * Math.PI / 180)},${200 + 180 * Math.sin((angle + 360 / LUCKY_WISHES.length - 90) * Math.PI / 180)} Z`}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </g>
              )
            })}

            {/* Center circle */}
            <circle cx="200" cy="200" r="40" fill="#fff" stroke="#FFE66D" strokeWidth="4" />
            <circle cx="200" cy="200" r="30" fill="#FFE66D" />
          </svg>
        </div>

        {/* Pointer at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="px-8 py-4 bg-gradient-to-r from-vibrant-orange to-coral text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        {isSpinning ? 'Đang quay...' : 'Quay Lời Chúc'}
      </button>

      {/* Wish Display */}
      {selectedWish && (
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center transform animate-in fade-in zoom-in">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-xl md:text-2xl font-semibold text-coral leading-relaxed">
            {selectedWish}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                ✨
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confetti Component */}
      <Confetti ref={confettiRef} />
    </div>
  )
}
