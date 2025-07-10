// src/components/CameraModal.js
'use client'

import { useEffect, useRef, useState } from 'react'

export default function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [stream, setStream] = useState(null)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [loading, setLoading] = useState(false)

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isFrontCamera ? 'user' : 'environment' },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      alert('Tidak dapat mengakses kamera')
    }
  }

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null)
      startCamera()
    } else {
      if (stream) stream.getTracks().forEach((track) => track.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (isOpen && capturedPhoto === null) {
      startCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFrontCamera])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
  
    // target canvas ratio
    const targetWidth = 852
    const targetHeight = 672
    canvas.width = targetWidth
    canvas.height = targetHeight
  
    const ctx = canvas.getContext('2d')
  
    // hitung crop center dari video stream
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight
    const videoAspect = videoWidth / videoHeight
    const targetAspect = targetWidth / targetHeight
  
    let sx, sy, sWidth, sHeight
  
    if (videoAspect > targetAspect) {
      // crop sisi kiri/kanan
      sHeight = videoHeight
      sWidth = videoHeight * targetAspect
      sx = (videoWidth - sWidth) / 2
      sy = 0
    } else {
      // crop atas/bawah
      sWidth = videoWidth
      sHeight = videoWidth / targetAspect
      sx = 0
      sy = (videoHeight - sHeight) / 2
    }
  
    if (isFrontCamera) {
      ctx.translate(targetWidth, 0)
      ctx.scale(-1, 1)
    }
  
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)
  
    const dataUrl = canvas.toDataURL('image/jpeg')
    setCapturedPhoto(dataUrl)
  
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }
  

  const handleSave = async () => {
    if (capturedPhoto && onCapture) {
      setLoading(true)
      try {
        await onCapture(capturedPhoto)
        onClose()
      } catch (err) {
        alert('Upload gagal')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRetake = async () => {
    setCapturedPhoto(null)
    await startCamera()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
      {loading ? (
        <div className="text-white">Uploading...</div>
      ) : !capturedPhoto ? (
        <>
          <div className="relative w-[90%] max-w-md aspect-[284/224] mx-auto z-20">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover rounded-lg ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
            />

            <div className='absolute top-0 right-0 p-3 z-10'
            onClick={() => {
                setIsFrontCamera((prev) => !prev)
            }}>
                <button
                className="bg-blue-600 text-white p-3 rounded-full flex items-center justify-center"
                >
                <img src="/images/switch.png" className="h-[24px]" alt="?" />
                </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCapture}
              className="bg-blue-600 text-white font-bold px-9 py-3 rounded-tl-3xl rounded-br-3xl flex items-center justify-center"
            >
                <img src="/images/camera.png" className="h-[20px] mr-2" alt="?" />
                Capture
            </button>
          </div>
        </>
      ) : (
        <>
            <div className="relative w-[90%] max-w-md aspect-[284/224] mx-auto z-20">
                <img src={capturedPhoto} className="w-full rounded-lg aspect-[284/224]" />
            </div>
            <div className="flex gap-4 mt-4">
                <button
                onClick={handleRetake}
                className="bg-gray-400 text-white font-bold px-6 py-2 rounded-tl-3xl rounded-br-3xl flex items-center justify-center"
                >
                    <img src="/images/retake.png" className="h-[20px] mr-2" alt="?" />
                    Retake
                </button>
                <button
                onClick={handleSave}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-tl-3xl rounded-br-3xl flex items-center justify-center"
                >
                    <img src="/images/save.png" className="h-[20px] mr-2" alt="?" />
                    Simpan
                </button>
            </div>
        </>
      )}
    </div>
  )
}
