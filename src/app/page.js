"use client";

import { useState, useEffect, useRef  } from "react";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleNext = () => {
    if (name.trim()) setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!agree || !password) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("project", "astranouts");
    formData.append("name", name);
    formData.append("password", password);

    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  // GAMBAR
  const imgRef = useRef(null)

  useEffect(() => {
    const el = imgRef.current
    let direction = 1
    let position = 0

    const animate = () => {
      position += direction * 2.5 // kecepatan gerak

      // bouncing logic (bolak-balik)
      if (position >= 50 || position <= -50) {
        direction *= -1
      }

      el.style.transform = `translateX(${position}px)`
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <main className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm p-4 pt-0 pb-0">
        <h1 className="text-center font-bold text-2xl leading-tight mb-4">
          Let’s Explore <br /> Astranauts 2025
        </h1>

        {step === 1 && (
          <>
          <div className="w-full rounded-tl-4xl rounded-br-4xl p-5 bg-linear-to-t from-[#EAECF3] to-[#F6F7F9] backdrop-blur-md border border-white/80 mb-6">
            <input
              className="w-full px-5 py-4 text-center text-gray-600 placeholder-gray-400 rounded-tl-4xl rounded-br-4xl p-6  bg-linear-to-t from-[#F2F4F8] to-[#F5F5F9] backdrop-blur-md text-xl border-2 border-white shadow-lg-black/50 outline-none font-medium"
              placeholder="Your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
            <button
              className={`w-full py-4 rounded-tl-4xl rounded-br-4xl font-bold text-xl text-white ${name ? "bg-blue-600" : "bg-gray-400"}`}
              onClick={handleNext}
              disabled={!name}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleLogin}>
            <div className="w-full rounded-tl-4xl rounded-br-4xl p-5 bg-linear-to-t from-[#EAECF3] to-[#F6F7F9] backdrop-blur-md border border-white/80 mb-3">
              <input
                className="w-full px-5 py-4 text-center text-gray-600 placeholder-gray-400 rounded-tl-4xl rounded-br-4xl p-6  bg-linear-to-t from-[#F2F4F8] to-[#F5F5F9] backdrop-blur-md text-xl border-2 border-white shadow-lg-black/50 outline-none font-medium"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <label className="flex items-start mb-4">
              <input
                type="checkbox"
                className="mt-1 mr-2"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className="text-xs text-gray-700">
                Saya memahami bahwa dengan mengisi data ini, saya setuju menerima penggunaan data pribadi saya.
              </span>
            </label>
            <button
              className={`w-full py-4 rounded-tl-4xl rounded-br-4xl font-bold text-xl text-white ${agree && password ? "bg-blue-600" : "bg-gray-400"}`}
              type="submit"
              disabled={!agree || !password || loading}
            >
              {loading ? "Loading..." : "Start Explore"}
            </button>
          </form>
        )}

        {result && <pre className="mt-4 text-xs text-gray-500">{JSON.stringify(result, null, 2)}</pre>}

      </div>

      <div className="w-full flex justify-center items-center overflow-hidden">
        <img
          ref={imgRef}
          src="/images/preview.png" // ganti dengan path sesuai
          alt="Booth"
          className="w-[550px] max-w-[550px]"
        />
      </div>
    </main>
  );
}