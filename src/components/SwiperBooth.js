// 'use client'
// import { useState } from 'react'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Pagination } from 'swiper/modules'
// import 'swiper/css'
// import 'swiper/css/pagination'

// export default function SwiperBooth({ booths, profile, onQuestion }) {
//     const [activeIndex, setActiveIndex] = useState(0)
//   return (
//     <div className="w-full overflow-hidden">
//       <Swiper
//         modules={[Pagination]}
//         pagination={{
//             clickable: true,
//         }}
//         className="mySwiper"
//         grabCursor={true}
//         spaceBetween={35}
//         onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//       >
//         {booths.map((booth) => (
//           <SwiperSlide key={booth.id}>
//             <div className="rounded-tl-4xl rounded-br-4xl p-2 px-3 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/50 shadow-xl mx-3">
//               <img
//                 src={booth.memberStamps?.[0]?.imageUrl || '/placeholder.jpg'}
//                 alt={booth.name}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="text-center font-medium py-2 text-sm">{booth.name}</div>
//             </div>
//           </SwiperSlide>
//         ))}
//             <SwiperSlide key={11}>
//             <div className="rounded-3xl bg-white shadow-md overflow-hidden">
//               <div className="text-center font-medium py-3">SHARE SOSMED</div>
//             </div>
//           </SwiperSlide>
//       </Swiper>

//       <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
//         <div className="flex items-center" onClick={onQuestion}>
//             <img src="/images/q.png" className="h-[36px]" alt="?" />
//         </div>
//         <div className="font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-3 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80 flex items-center gap-1">
//           <img src="/images/coin.png" className="h-[20px]" alt="coin" />
//           <span>{profile?.coins ?? 0} Coins</span>
//         </div>
//         <div className='min-w-[62px] font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-3 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80'>{(activeIndex + 1).toString().padStart(2, '0')}/{(booths.length + 1).toString().padStart(2, '0')}</div>
//       </div>
//     </div>
//   )
// }


'use client'
import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function SwiperBooth({ booths, profile, onQuestion }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [boothImages, setBoothImages] = useState(Array(booths.length).fill(null))

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
  
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      } else {
        // Delay hingga ref tersedia
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
          }
        }, 300)
      }
  
      setStream(mediaStream)
      setShowCamera(true)
      setCapturedPhoto(null)
    } catch (err) {
      console.error('Kamera error:', err)
      alert('Gagal mengakses kamera: ' + err.message)
    }
  }  

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg')
    setCapturedPhoto(dataUrl)
  }

  const handleSave = async () => {
    if (!capturedPhoto) return
    const res = await fetch(capturedPhoto)
    const blob = await res.blob()
    const formData = new FormData()
    formData.append('photo', blob, 'capture.jpg')
    formData.append('boothId', booths[activeIndex]?.id)

    await fetch('/api/upload-photo', {
      method: 'POST',
      body: formData,
    })

    const updatedImages = [...boothImages]
    updatedImages[activeIndex] = capturedPhoto
    setBoothImages(updatedImages)

    alert('Foto berhasil disimpan')
    if (stream) stream.getTracks().forEach((track) => track.stop())
    setShowCamera(false)
  }

  const handleRetake = () => {
    setCapturedPhoto(null)
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
        {booths.map((booth, index) => (
          <SwiperSlide key={booth.id}>
            <div className="rounded-tl-4xl rounded-br-4xl p-2 px-3 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/50 shadow-xl mx-3">
              <img
                src={boothImages[index] || booth.memberStamps?.[0]?.imageUrl || '/placeholder.jpg'}
                alt={booth.name}
                className="w-full h-48 object-cover"
              />
              <div className="text-center font-medium py-2 text-sm">{booth.name}</div>
              <button
                onClick={handleOpenCamera}
                className="bg-blue-600 text-white px-6 py-2 mt-2 rounded-full text-sm font-semibold"
              >
                FOTO
              </button>
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide key={11}>
          <div className="rounded-3xl bg-white shadow-md overflow-hidden">
            <div className="text-center font-medium py-3">SHARE SOSMED</div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
        <div className="flex items-center" onClick={onQuestion}>
          <img src="/images/q.png" className="h-[36px]" alt="?" />
        </div>
        <div className="font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-3 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80 flex items-center gap-1">
          <img src="/images/coin.png" className="h-[20px]" alt="coin" />
          <span>{profile?.coins ?? 0} Coins</span>
        </div>
        <div className='min-w-[62px] font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-3 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80'>
          {(activeIndex + 1).toString().padStart(2, '0')}/{(booths.length + 1).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          {!capturedPhoto ? (
            <>
                <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md rounded-lg"
                />
              <canvas ref={canvasRef} className="hidden" />
              <button
                onClick={handleCapture}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                Capture
              </button>
            </>
          ) : (
            <>
              <img src={capturedPhoto} className="w-full max-w-md rounded-lg" />
              <div className="flex gap-4 mt-4">
                <button onClick={handleRetake} className="bg-gray-400 text-white px-6 py-2 rounded-full">Retake</button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-full">Simpan</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}