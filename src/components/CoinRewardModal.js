'use client'

import Image from 'next/image';

export default function CoinRewardModal({ isOpen, onClose, reward }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="w-full flex flex-col items-center justify-center px-6">
            <div className="w-full rounded-tl-4xl rounded-br-4xl p-5 bg-linear-to-t from-[#CAD8FF] to-[#ffffff] text-center border border-white/80">
                <Image
                  src="/images/coin.png"
                  alt="astra"
                  className="mx-auto h-12 mb-4"
                  width={80}
                  height={80}
                />
                <h3 className="text-lg font-bold mb-1">Kamu Dapat {reward} Koin!</h3>
                <p className="text-sm text-gray-700 mb-6">
                  Kumpulkan <strong>11 stempel</strong>, <br/> untuk dapat <strong>5 koin</strong> maksimal!
                </p>
                <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white rounded-tl-4xl rounded-br-4xl py-3 font-semibold"
                >
                  Continue
                </button>
            </div>
        </div>
    </div>
  )
}
