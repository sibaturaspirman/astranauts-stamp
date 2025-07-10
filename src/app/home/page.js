// import { useState } from 'react';
import { cookies } from 'next/headers'
import { apiFetcher } from '@/lib/api/fetcher'
// import SwiperBooth from '@/components/SwiperBooth'
// import IntroSwiper from '@/components/IntroSwiper'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
    let booths = [], profile = null
    let error = null

    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('tokenAstranauts')?.value

        if (!token) {
        throw new Error('Unauthorized: Token tidak ditemukan')
        }

        booths = await apiFetcher('/booth', token)
        profile = await apiFetcher('/auth/profile', token)

        if (!Array.isArray(booths)) {
        throw new Error('Data booth tidak valid')
        }
    } catch (err) {
        console.error('❌ Fetch booth error:', err.message)
        error = err.message
    }

    return <HomeClient booths={booths} profile={profile} />

//   return (
//     <main className="w-full max-w-sm p-4 pt-0 pb-0">
//         <h2 className="text-center text-sm mb-1">Hi, {profile?.name || '...'}</h2>
//         <h1 className="text-center font-bold text-lg mb-3">Let's Explore Astranauts 2025</h1>

//         <IntroSwiper hidden={!showIntro} />

//         <div className="w-full">
//             <SwiperBooth booths={booths} profile={profile} onQuestion={() => setShowIntro(true)} />
//         </div>
//     </main>
//   )
}
