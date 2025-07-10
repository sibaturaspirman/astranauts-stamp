'use client'

import { useState } from 'react'
import IntroSwiper from './IntroSwiper'
import SwiperBooth from './SwiperBooth'

export default function HomeClient({ booths, profile }) {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <main className="w-full max-w-sm p-4 pt-0 pb-0">
        <h2 className="text-center text-sm mb-0">Hi, {profile?.name || '...'}</h2>
        <h1 className="text-center font-bold text-lg mb-2">Let&apos;s Explore Astranauts 2025</h1>

        <IntroSwiper hidden={showIntro} onFinished={() => setShowIntro(true)} />
        <div className="w-full">
            <SwiperBooth booths={booths} profile={profile} onQuestion={() => setShowIntro(false)} />
        </div>
    </main>
  )
}
