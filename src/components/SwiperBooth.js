'use client'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function SwiperBooth({ booths, profile }) {
    const [activeIndex, setActiveIndex] = useState(0)
  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Pagination]}
        pagination={{
            clickable: true,
        }}
        className="mySwiper"
        grabCursor={true}
        spaceBetween={15}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {booths.map((booth) => (
          <SwiperSlide key={booth.id}>
            <div className="rounded-3xl bg-white shadow-md overflow-hidden">
              <img
                src={booth.memberStamps?.[0]?.imageUrl || '/placeholder.jpg'}
                alt={booth.name}
                className="w-full h-48 object-cover"
              />
              <div className="text-center font-medium py-3">{booth.name}</div>
            </div>
          </SwiperSlide>
        ))}
            <SwiperSlide key={11}>
            <div className="rounded-3xl bg-white shadow-md overflow-hidden">
              {/* <img
                src={booth.memberStamps?.[0]?.imageUrl || '/placeholder.jpg'}
                alt={booth.name}
                className="w-full h-48 object-cover"
              /> */}
              <div className="text-center font-medium py-3">SHARE SOSMED</div>
            </div>
          </SwiperSlide>
      </Swiper>

      <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
        <span>?</span>
        <div className="flex items-center gap-1">
          <img src="/coin.svg" className="h-4" alt="coin" />
          <span>{profile?.coins ?? 0} Coins</span>
        </div>
        <div>{(activeIndex + 1).toString().padStart(2, '0')}/{(booths.length + 1).toString().padStart(2, '0')}</div>
      </div>
    </div>
  )
}
