'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function SwiperBooth({ booths, profile }) {
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
        onSlideChange={(swiper) => {
        }}
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
      </Swiper>

      <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
        <span>?</span>
        <div className="flex items-center gap-1">
          <img src="/coin.svg" className="h-4" alt="coin" />
          <span>{profile?.coins ?? 0} Coins</span>
        </div>
        <div>{booths.length.toString().padStart(2, '0')}/11</div>
      </div>
    </div>
  )
}
