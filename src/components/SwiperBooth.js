'use client'

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react'
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
            // console.log(data)
        } else {
            alert('Upload gagal!')
        }

        const updatedImages = [...boothImages]
        updatedImages[activeIndex] = photoDataUrl
        setBoothImages(updatedImages)
        // alert('Foto berhasil disimpan')
    }

    //STAMP
    const [startStamp, setStartStamp] = useState(false)
    const [confirmStamp, setConfirmStamp] = useState(false)
    const [stamping, setStamping] = useState(false)
    const [stampStatus, setStampStatus] = useState(null) // null | 'loading' | 'success'

    const [topLeftX, setTopLeftX] = useState(0);
    const [topLeftY, setTopLeftY] = useState(0);
    const [topRightX, setTopRightX] = useState(0);
    const [topRightY, setTopRightY] = useState(0);
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);

    // // REFACTOR CANVAS
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const sentuhanRef = useRef({});
    const [errorObject, setErrorObject] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        contextRef.current = context;
      }, []);

      const drawTouches = (ctx, canvas, touchPoints) => {
        if (!ctx || !canvas) return;
      
        // Bersihkan canvas sebelum menggambar ulang
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        touchPoints.forEach((t) => {
        //   Gambar lingkaran titik
          ctx.beginPath();
          ctx.arc(t.x, t.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = 'blue';
          ctx.fill();
      
        //   Tampilkan koordinat X/Y
        //   ctx.font = '10px Arial';
        //   ctx.fillStyle = 'black';
        //   ctx.fillText(`X: ${Math.round(t.x)} | Y: ${Math.round(t.y)}`, t.x - 30, t.y + 30);
        });
      };
    
      const handleTouchStart = (e) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const rect = canvas.getBoundingClientRect();
      
        sentuhanRef.current = {}; // reset data sentuhan
      
        // Simpan titik-titik baru
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          sentuhanRef.current[touch.identifier] = { x, y };
        }
      
        // Gambar titik-titik baru
        // const points = Object.values(sentuhanRef.current);
        // drawTouches(ctx, canvas, points);
      };
    
      const handleTouchMove = (e) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const rect = canvas.getBoundingClientRect();
      
        const touches = Array.from(e.touches).map((t) => ({
          x: t.clientX - rect.left,
          y: t.clientY - rect.top,
        }));
      
        // drawTouches(ctx, canvas, touches);
      };
    
      const checkSquarePattern = (points) => {
        if (points.length !== 2) return false;

        points.sort((a, b) => a.x - b.x || a.y - b.y);
        const [topLeft, topRight] = points;

        const thresholdXDistMin = 130;
        const thresholdXDistMax = 150;
        const thresholdYDistMin = 80;
        const thresholdYDistMax = 105;

        setTopLeftX(Math.round(topLeft.x))
        setTopLeftY(Math.round(topLeft.y))
        if(topRight != undefined){
            setTopRightX(Math.round(topRight.x))
            setTopRightY(Math.round(topRight.y))

            setXPos(Math.round(topRight.x - topLeft.x))
            setYPos(Math.round(topLeft.y - topRight.y))
        }

        const isXPosMin = Math.round(topRight.x - topLeft.x) >= thresholdXDistMin;
        const isXPosMax = Math.round(topRight.x - topLeft.x) <= thresholdXDistMax;
        const isYPosMin = Math.round(topLeft.y - topRight.y) >= thresholdYDistMin;
        const isYPosMax = Math.round(topLeft.y - topRight.y) <= thresholdYDistMax;
        const isXRightMoreLeft = topRight.x > topLeft.x;
        const isYLeftMoreRight = topLeft.y > topRight.y;

        return isXPosMin && isXPosMax && isYPosMin && isYPosMax && isXRightMoreLeft && isYLeftMoreRight;
        // return true
      };
    
      const handleStamp = async () => {
        // alert(boothData[activeIndex].id)
        // console.log(boothData[activeIndex].id)
        let boothId = boothData[activeIndex].id
        setStamping(true)
        setStampStatus('loading')
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
            setStampStatus('success')

            setTimeout(() => {
                setStampStatus(null)
                setConfirmStamp(false)
            }, 3000)
            setStamping(false)
        } else {
            // alert('Stamp GAGAL!')
            console.log("Stamp GAGAL!")
            setStampStatus(null)
        }
      };
    
      const handleTouchEnd = async (e) => {
        const points = Object.values(sentuhanRef.current);

        // Debug: log dulu untuk memastikan isi points
        // console.log("Sentuhan points", points);

        const isMatch = checkSquarePattern(points);
        if (isMatch) {
            await handleStamp();
        }
      };
    // // !REFACTOR CANVAS

    const handleStampTAP = async (boothId) => {
        setStamping(true)
        setStampStatus('loading')
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
            setStampStatus('success')
        } else {
            alert('Stamp GAGAL!')
            setStampStatus(null)
        }

        setTimeout(() => {
            setStampStatus(null)
            setConfirmStamp(false)
        }, 2000)
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

        //   console.log('📦 booth:', booth.id, booth.memberStamps?.[0]?.stampedAt)


          return (
            <SwiperSlide key={booth.id}>
              <div className="rounded-tl-4xl rounded-br-4xl p-6 pb-2 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/50 shadow-xl mx-3 relative">
                {imageUrl ? (
                  <div className='relative w-full border-[1px] border-dashed border-[#C8C8C8] rounded-tl-xl rounded-br-xl'>
                    <Image
                        src={imageUrl}
                        alt={booth.name}
                        className="aspect-[284/224] w-full object-cover rounded-tl-xl rounded-br-xl"
                        width={284}
                        height={224}
                    />
                  </div>
                ) : (
                  <div className='aspect-[284/224] flex items-center justify-center flex-col bg-[#F1F4F9] border-[1px] border-dashed border-[#C8C8C8] rounded-tl-xl rounded-br-xl' onClick={() => setShowCamera(true)}>
                    <div>
                        <Image
                            src="/images/selfie.png"
                            alt="astra"
                            className="h-[64px]"
                            width={64}
                            height={64}
                        />
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
                                <Image
                                    src="/images/stamp-check.png"
                                    alt="astra"
                                    className="absolute bottom-[-3rem] right-[0rem] w-[120px]"
                                    width={120}
                                    height={120}
                                />
                            </div>
                        ) : (
                            <div className='absolute top-0 right-0 w-full h-full'>
                                {/* <button
                                    disabled={stamping}
                                    onClick={() => handleStamp(booth.id)}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 text-sm rounded-full"
                                >
                                    {stamping ? 'Memproses...' : 'STAMP SEKARANG'}
                                </button> */}
                                {/* <button
                                    disabled={stamping}
                                    onClick={() => setConfirmStamp(true)}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 text-sm rounded-full"
                                >
                                    STAMP SEKARANG
                                </button> */}
                                <button
                                    disabled={stamping}
                                    onClick={() => setConfirmStamp(true)} className="bg-blue-600 text-white px-3 py-2 rounded-tl-2xl rounded-br-2xl text-sm font-semibold mt-3">TAP UNTUK STAMP</button>
                                <Image
                                    src="/images/stamp-here.png"
                                    alt="astra"
                                    className="absolute bottom-[-3rem] right-[0rem] w-[120px]"
                                    width={120}
                                    height={120}
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
          <div className="rounded-tl-4xl rounded-br-4xl p-6 pb-2 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/50 shadow-xl mx-3 relative">
            <div className='absolute top-0 right-0 w-full h-full'>
                <button
                    disabled={stamping}
                    onClick={() => setConfirmStamp(true)} className="bg-blue-600 text-white px-3 py-2 rounded-tl-2xl rounded-br-2xl text-sm font-semibold mt-3">TAP UNTUK STAMP</button>
                <Image
                    src="/images/stamp-here.png"
                    alt="astra"
                    className="absolute bottom-[-3rem] right-[0rem] w-[120px]"
                    width={120}
                    height={120}
                />
            </div>
            <div className="text-center font-medium mb-5">
                <Image
                    src="/images/sosmed.png"
                    alt="astra"
                    className="w-[80%] mx-auto"
                    width={279}
                    height={279}
                />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
        <div className="w-full flex flex-col items-center gap-0 mt-0">
            {profileData?.coins >= 1 && (
                <Link
                    href="/prize"
                    className="bg-blue-600 text-white text-sm font-bold px-3 py-3 mt-2 mb-[-1] rounded-tl-2xl rounded-br-2xl shadow text-center"
                >
                    Dapatkan Hadiah di Claw Machine!
                </Link>
            )}

            <div className="flex items-center justify-between text-xs text-gray-600 w-full mt-3">
                <div className="flex items-center" onClick={onQuestion}>
                    <Image
                        src="/images/q.png"
                        alt="astra"
                        className="h-[36px] h-[36px]"
                        width={36}
                        height={36}
                    />
                </div>
                <div className="font-medium text-sm rounded-tl-xl rounded-br-xl p-2 px-4 bg-linear-to-t from-[#CAD8FF]/50 to-[#ffffff] text-center border border-white/80 flex items-center gap-1">
                    <Image
                        src="/images/coin.png"
                        alt="astra"
                        className="h-[20px] mr-1"
                        width={20}
                        height={20}
                    />
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

        {/* STAMP AREA */}
        {/* {confirmStamp && ( */}
            <div className={`fixed inset-0 flex items-center justify-center bg-black/90 ${confirmStamp ? 'z-[105] pointer-events-nonex' : 'z-[105] pointer-events-none opacity-0'}`}>

                {stampStatus === 'loading' ? (
                    <>
                    <div className="absolute bg-white rounded-xl shadow-xl text-center p-6 w-80">
                        <h3 className="text-lg font-bold mb-2">Proses Stamp</h3>
                        <p className="text-sm text-gray-600">Mohon tunggu sebentar...</p>
                    </div>
                    </>
                ) : stampStatus === 'success' ? (
                    <>
                    <div className="absolute text-center p-6 w-80">
                        <div className={`block m-auto w-[160px] pointer-events-none`}>
                            <Image src={'/images/stamp-berhasil.png'} width={180} height={180}  alt='Zirolu' className='w-full' priority />
                        </div>
                        <h3 className="text-lg font-bold mb-1 mt-2 text-white">Stamp Berhasil!</h3>
                        <p className="text-sm text-white">Kumpulkan lagi stempel untuk dapatkan koin!</p>

                        <p className="text-xs text-white mt-2">Tunggu sebentar...</p>
                    </div>
                    </>
                ) : (
                    <>
                        <div className={`absolute m-auto w-[220px] pointer-events-none`}>
                            <Image src={'/images/stamp-preview.png'} width={220} height={220}  alt='Zirolu' className='w-full' priority  onClick={() => handleStampTAP(boothData[activeIndex].id)} />
                        </div>
                        
                        <div className='absolute bottom-0 pb-8 z-50'>
                            <button
                                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-tl-3xl rounded-br-3xl flex items-center justify-center"
                                onClick={() => setConfirmStamp(false)}
                            >
                                Nanti Lagi
                            </button>
                        </div>
                    </>
                )}


                <canvas ref={canvasRef} className={`relative z-40 ${stampStatus === null ? '' : 'pointer-events-none'}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                />
            </div>
        {/* )} */}
        {/* <div className={`fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center flex-col ${startStamp ? 'z-[105] pointer-events-nonex' : 'z-[105] pointer-events-none opacity-0'}`}>

            <div className='absolute z-[50] mt-[-5rem] pointer-events-none'>
                {!statusStamp &&
                <div className={`relative w-[250px]`}>
                <Image src={'/images/n-stamp-here.png'} width={176} height={176}  alt='Zirolu' className='w-full' priority  onClick={handleStamp} />
                </div>
                }

                {statusStamp &&
                <div className={`relative w-[250px] ${loadingStamp ? 'opacity-0' : ''}`}>
                <Image src={'/images/stamp-check.png'} width={176} height={176}  alt='Zirolu' className='w-full' priority />
                <p className="text-center py-3 text-[#fff]">Stamp berhasil!</p>
                </div>
                }

                {loadingStamp ? (
                <p className="text-center py-3 text-[#fff]">Validasi stamp berlangsung...</p>
                ) : (
                <p className="text-center py-3 text-[#fff] opacity-0">Validasi</p>
                )}



                <div className="text-center py-3 opacity-0">
                {errorObject && (
                    <pre className="mt-4 p-3 bg-gray-100 text-sm rounded border overflow-x-auto">
                    {JSON.stringify(errorObject, null, 2)}
                    </pre>
                )}
                </div>
                
            </div>
            
            {claimHadiah &&
            <Link
            href={'/'+mall+'/experience/spin'} className={`absolute bottom-[2rem] w-[max-content] pointer-events-nonex z-[45]`}> <Image src={'/images/claim.png'} width={295} height={56}  alt='Zirolu' className='w-full' priority /></Link>
            }

            {!claimHadiah &&
            <button onClick={backStamp} className={`absolute bottom-[2rem] w-[max-content] pointer-events-nonex left-0 right-0 inline-block mx-auto text-center px-8 py-3 text-base font-bold bg-[#2A2A5C] rounded-full text-[#fff] z-[45] ${loadingStamp ? 'opacity-0' : ''}`}>Kembali Jelajahi</button>
            }

            <canvas ref={canvasRef} className={`relative z-40'`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            />
        </div> */}
    </div>
  )
}