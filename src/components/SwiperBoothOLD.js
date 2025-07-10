'use client'
import { useState } from 'react'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import CameraModal from './CameraModal'
import CoinRewardModal from './CoinRewardModal'

export default function SwiperBooth({ booths, profile, onQuestion }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [showCamera, setShowCamera] = useState(false)
    const [boothData, setBoothData] = useState(booths)
    const [boothImages, setBoothImages] = useState(Array(booths.length).fill(null))
    const [stamping, setStamping] = useState(false)
    const [profileData, setProfileData] = useState(profile)
    const [showReward, setShowReward] = useState(false)
    const [lastCoin, setLastCoin] = useState(profile?.coins || 0)
    const [coinGain, setCoinGain] = useState(0)


    const handleSavePhoto = async (photoDataUrl) => {
        const res = await fetch(photoDataUrl)
        const blob = await res.blob()
        const formData = new FormData()
        formData.append('photo', blob, 'capture.jpg')
        formData.append('boothId', booths[activeIndex]?.id)

        const resapi = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        })

        const data = await resapi.json();

        if (resapi.ok) {
            console.log(data)
        } else {
        alert('Upload gagal!')
        }

        const updatedImages = [...boothImages]
        updatedImages[activeIndex] = photoDataUrl
        setBoothImages(updatedImages)
        // alert('Foto berhasil disimpan')
    }

    const handleStamp = async (boothId) => {
        setStamping(true)
        const res = await fetch(`/api/stamp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boothId }),
        })

        if (res.ok) {
            const allRes = await fetch('/api/booth')
            const allBooths = await allRes.json()
            setBoothData(allBooths)

            const profileRes = await fetch('/api/profile')
            const updatedProfile = await profileRes.json()

            const diff = updatedProfile.coins - lastCoin
            if (diff > 0) {
                setCoinGain(diff)
                setShowReward(true)
            }

            setProfileData(updatedProfile)
            setLastCoin(updatedProfile.coins)
        } else {
            alert('Stamp gagal')
        }
        setStamping(false)
    }
  

  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="mySwiper"
        grabCursor={true}
        spaceBetween={35}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {boothData.map((booth, index) => {
        //   const hasImage = boothImages[index] || booth.memberStamps?.[0]?.imageUrl
            const imageUrl = boothImages[index] || booth.memberStamps?.[0]?.imageUrl
          const stampedAt = booth.memberStamps?.[0]?.stampedAt

          console.log('📦 booth:', booth.id, booth.memberStamps?.[0]?.stampedAt)


          return (
            <SwiperSlide key={booth.id}>
              <div className="rounded-tl-4xl rounded-br-4xl p-6 pb-2 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/50 shadow-xl mx-3 relative">
                {imageUrl ? (
                  <div className='relative w-full border-[1px] border-dashed border-[#C8C8C8] rounded-tl-xl rounded-br-xl'>
                    <img
                      src={imageUrl}
                      alt={booth.name}
                      className="aspect-[284/224] w-full object-cover rounded-tl-xl rounded-br-xl"
                    />
                  </div>
                ) : (
                  <div className='aspect-[284/224] flex items-center justify-center flex-col bg-[#F1F4F9] border-[1px] border-dashed border-[#C8C8C8] rounded-tl-xl rounded-br-xl' onClick={() => setShowCamera(true)}>
                    <div>
                      <img src="/images/selfie.png" className="h-[64px]" alt="?" />
                    </div>
                    <p className='font-medium text-sm mt-2 mb-2'>Ambil Foto Kegiatanmu</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-tl-2xl rounded-br-2xl text-sm font-semibold">FOTO</button>
                  </div>
                )}
                <div className="text-center font-bold py-2 text-sm">{booth.name}</div>

                {imageUrl ? (
                    <div className='absolute top-0 right-0 w-full h-full z-50'>
                        {stampedAt ? (
                            <div className='absolute top-0 right-0 w-full h-full'>
                                <img
                                    src="/images/stamp-check.png"
                                    className="absolute bottom-[-3rem] right-[0rem] w-[120px]"
                                    alt="stamp now"
                                />
                            </div>
                        ) : (
                            <div className='absolute top-0 right-0 w-full h-full'>
                                <button
                                    disabled={stamping}
                                    onClick={() => handleStamp(booth.id)}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 text-sm rounded-full"
                                >
                                    {stamping ? 'Memproses...' : 'STAMP SEKARANG'}
                                </button>
                                <img
                                    src="/images/stamp-here.png"
                                    className="absolute bottom-[-3rem] right-[0rem] w-[120px]"
                                    alt="stamp now"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div></div>
                )}
                
                
              </div>
            </SwiperSlide>
          )
        })}
        <SwiperSlide key={11}>
          <div className="rounded-3xl bg-white shadow-md overflow-hidden">
            <div className="text-center font-medium py-3">SHARE SOSMED</div>
          </div>
        </SwiperSlide>
      </Swiper>
        <div className="w-full flex flex-col items-center gap-1 mt-1">
            {profileData?.coins >= 1 && (
                <Link
                    href="/prize"
                    className="bg-blue-600 text-white text-sm font-bold px-6 py-3 mb-2 rounded-tl-2xl rounded-br-2xl shadow text-center"
                >
                    Dapatkan Hadiah di Claw Machine!
                </Link>
            )}

            <div className="flex items-center justify-between text-xs text-gray-600 w-full">
                <div className="flex items-center" onClick={onQuestion}>
                    <img src="/images/q.png" className="h-[36px]" alt="?" />
                </div>
                <div className="font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-4 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80 flex items-center gap-1">
                    <img src="/images/coin.png" className="h-[20px] mr-1" alt="coin" />
                    <span>{profileData?.coins ?? 0} Coins</span>
                </div>
                <div className='min-w-[62px] font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-3 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80'>
                    {(activeIndex + 1).toString().padStart(2, '0')}/{(booths.length + 1).toString().padStart(2, '0')}
                </div>
            </div>
        </div>

      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleSavePhoto}
      />
      <CoinRewardModal
        isOpen={showReward}
        reward={coinGain}
        onClose={() => setShowReward(false)}
    />
    </div>
  )
}