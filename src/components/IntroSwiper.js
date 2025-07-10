// src/components/IntroSwiper.js
'use client'

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const slides = [
  {
    icon: '/images/intro1.png',
    title: 'Kunjungi Booth',
    desc: 'Eksplor seluruh booth di Astranauts 2025',
    button: 'Next',
  },
  {
    icon: '/images/intro2.png',
    title: 'Buka Kamera Handphone-mu',
    desc: 'Ambil foto kegiatanmu di setiap booth',
    button: 'Next',
  },
  {
    icon: '/images/intro3.png',
    title: 'Kumpulkan Stempel',
    desc: 'Minta stempel di setiap booth yang kamu kunjungi',
    button: 'Next',
  },
  {
    icon: '/images/intro4.png',
    title: 'Dapatkan Koin',
    desc: 'Selesaikan challenge dan dapatkan 5 koin untuk bermain Digital Claw Machine',
    button: 'Next',
  },
  {
    icon: '/images/intro5.png',
    title: 'Share di Media Sosial',
    desc: 'Bagikan keseruan pengalamanmu di Astranauts 2025!',
    button: 'Get Started',
  },
]

export default function IntroSwiper({ hidden, onFinished }) {
    const swiperRef = useRef(null)

    useEffect(() => {
        if (!hidden) {
            swiperRef.current?.slideTo(0)
        }
    }, [hidden])

    return (
        <div className={`fixed w-full h-full top-0 left-0 bg-black/80 z-50 flex items-center justify-center transition ${hidden ? 'opacity-0 pointer-events-none' : ''}`}>
            <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="introSwiper w-full"
            >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                <div className="w-full flex flex-col items-center justify-center px-6">
                    <div className="w-full rounded-tl-4xl rounded-br-4xl p-5 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/80">
                    <img
                        src={slide.icon}
                        alt={slide.title}
                        className="w-[70%] mx-auto"
                    />
                    <h2 className="text-lg font-bold mb-1">{slide.title}</h2>
                    <p className="text-sm text-gray-700 mb-6">{slide.desc}</p>
                    <button
                        className="w-full bg-blue-600 text-white rounded-tl-4xl rounded-br-4xl py-3 font-semibold"
                        onClick={() => {
                            if (index === slides.length - 1 && onFinished) {
                                onFinished()
                            } else {
                                swiperRef.current?.slideNext()
                            }
                        }}
                    >
                        {slide.button}
                    </button>
                    </div>
                </div>
                </SwiperSlide>
            ))}
            </Swiper>  
        </div>
    )
}