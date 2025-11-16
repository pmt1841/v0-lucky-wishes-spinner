'use client'

import { useState, useEffect } from 'react'
import LuckyWheelSpinner from '@/components/lucky-wheel-spinner'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-golden via-coral to-skyblue flex items-center justify-center p-4">
      <LuckyWheelSpinner />
    </main>
  )
}
