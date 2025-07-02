import { useState } from "react";

const options = {
  telinga: [
    { label: "Menghadap Depan", value: 0, emoji: "👂" },
    { label: "Menghadap Samping", value: 5, emoji: "↩️" },
    { label: "Rendah", value: 10, emoji: "👇" },
    { label: "Tegak", value: 15, emoji: "👆" },
  ],
  ekor: [
    { label: "Melengkung", value: 0, emoji: "🌙" },
    { label: "Melilit Tubuh", value: 5, emoji: "🌀" },
    { label: "Rendah", value: 10, emoji: "⬇️" },
    { label: "Tegak Lurus", value: 20, emoji: "⬆️" },
  ],
  mata: [
    { label: "Mata Lebar dengan Pupil Membesar", value: 5, emoji: "😳" },
    { label: "Menatap Tajam", value: 10, emoji: "👀" },
    { label: "Pupil Mengecil", value: 15, emoji: "😤" },
    { label: "Setengah Menutup", value: 20, emoji: "😌" },
    { label: "Tertutup", value: 25, emoji: "😴" },
  ],
  postur: [
    { label: "Berdiri", value: 0, emoji: "🧍" },
    { label: "Duduk", value: 5, emoji: "🪑" },
    { label: "Membungkuk", value: 10, emoji: "🙇" },
    { label: "Tidur", value: 15, emoji: "💤" },
  ],
  bulu: [
    { label: "Halus", value: 0, emoji: "✨" },
    { label: "Naik", value: 10, emoji: "📈" },
    { label: "Kusut", value: 20, emoji: "🌪️" },
  ],
  mulut: [
    { label: "Tertutup", value: 0, emoji: "😐" },
    { label: "Sedikit Terbuka", value: 5, emoji: "😮" },
    { label: "Terbuka Lebar", value: 10, emoji: "😲" },
  ],
};

const CatMoodForm = ({ onNewEntry }) => {
  const [formData, setFormData] = useState({
    telinga: "",
    ekor: "",
    mata: "",
    postur: "",
    bulu: "",
    mulut: "",
  });
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completedFields, setCompletedFields] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);

  const predictMood = async (input) => {
    const moods = [
      "Bahagia 😸",
      "Santai 😌",
      "Waspada 😾",
      "Mengantuk 😴",
      "Marah 😡",
      "Takut 😿",
      "Penasaran 🤔",
    ];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    return randomMood;
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (value !== "") {
      setCompletedFields((prev) => new Set([...prev, field]));
    } else {
      setCompletedFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const handleSubmit = async () => {
    const emptyFields = Object.entries(formData).filter(([_, value]) => value === "");
    if (emptyFields.length > 0) {
      alert("Mohon lengkapi semua field!");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const numericInput = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, parseInt(v, 10)])
    );
    const label = await predictMood(numericInput);
    setResult(label);
    setShowPopup(true);
    setIsLoading(false);
    onNewEntry?.();
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setResult("");
  };

  const progressPercentage = (completedFields.size / Object.keys(options).length) * 100;
  const fieldNames = {
    telinga: "Telinga",
    ekor: "Ekor",
    mata: "Mata",
    postur: "Postur",
    bulu: "Bulu",
    mulut: "Mulut",
  };

  return (
    <div className="">
      {/* Popup Result */}
      {showPopup && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handlePopupClose}
        >
          <div
            className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border-4 border-yellow-400/60 shadow-2xl animate-bounce-in ring-4 ring-yellow-300/30 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Mood Kucing Anda:
              </h3>
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-4xl font-black py-4 px-6 rounded-2xl shadow-2xl border-4 border-white/50">
                  <div className="drop-shadow-lg">{result}</div>
                </div>
              </div>
              <p className="text-gray-700 text-lg mt-4 font-semibold">
                🐾 Berdasarkan analisis perilaku kucing Anda 🐾
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <div className="animate-bounce text-2xl" style={{ animationDelay: "0s" }}>💖</div>
                <div className="animate-bounce text-2xl" style={{ animationDelay: "0.2s" }}>🌟</div>
                <div className="animate-bounce text-2xl" style={{ animationDelay: "0.4s" }}>🎈</div>
                <div className="animate-bounce text-2xl" style={{ animationDelay: "0.6s" }}>✨</div>
                <div className="animate-bounce text-2xl" style={{ animationDelay: "0.8s" }}>🎊</div>
              </div>
              <button
                className="mt-8 px-6 py-2 bg-yellow-400 text-white font-bold rounded-xl shadow hover:bg-yellow-500 transition"
                onClick={handlePopupClose}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-8 h-8 bg-pink-300/40 rounded-full flex items-center justify-center text-white font-bold">♥</div>
        </div>
        <div className="absolute top-32 right-20 animate-pulse">
          <div className="w-6 h-6 bg-yellow-300/50 rounded-full flex items-center justify-center text-white text-sm">✦</div>
        </div>
        <div className="absolute bottom-32 left-20 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="w-10 h-10 bg-amber-300/40 rounded-full flex items-center justify-center text-white font-bold text-lg">★</div>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce" style={{ animationDelay: "1s" }}>
          <div className="w-7 h-7 bg-orange-300/50 rounded-full flex items-center justify-center text-white font-bold">⚡</div>
        </div>
        <div className="absolute top-1/2 left-1/4 animate-pulse" style={{ animationDelay: "2s" }}>
          <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-gray-700 font-bold">🐾</div>
        </div>
        <div className="absolute top-1/3 right-1/3 animate-bounce" style={{ animationDelay: "1.5s" }}>
          <div className="w-6 h-6 bg-cyan-300/40 rounded-full flex items-center justify-center text-white text-sm">●</div>
        </div>
        <div className="absolute top-3/4 right-1/4 animate-pulse" style={{ animationDelay: "3s" }}>
          <div className="w-6 h-6 bg-indigo-300/40 rounded-full flex items-center justify-center text-white">🌙</div>
        </div>
        <div className="absolute top-16 right-1/2 animate-bounce" style={{ animationDelay: "2.5s" }}>
          <div className="w-5 h-5 bg-emerald-300/40 rounded-full flex items-center justify-center text-white text-xs">✧</div>
        </div>
        <div className="absolute top-40 left-1/3 animate-pulse" style={{ animationDelay: "4s" }}>
          <div className="w-7 h-7 bg-purple-300/40 rounded-full flex items-center justify-center text-white">💎</div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-bounce" style={{ animationDelay: "3.5s" }}>
          <div className="w-6 h-6 bg-rose-300/40 rounded-full flex items-center justify-center text-white">🦋</div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header with Animation */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-4 hover:scale-110 transition-transform duration-300">
            <div className="text-6xl animate-pulse">🐱</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg animate-fade-in">
            Cat Mood Detector
          </h1>
          <p className="text-white/80 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
            ✨ Temukan mood kucing kesayangan Anda! ✨
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/90 font-medium">Progress</span>
            <span className="text-white/90 font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
          {Object.entries(options).map(([field, opts], index) => (
            <div key={field} className="mb-6 last:mb-0">
              <label className="flex items-center font-bold text-white mb-3 text-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                    completedFields.has(field)
                      ? "bg-green-500 text-white shadow-lg scale-110"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {completedFields.has(field) ? "✓" : index + 1}
                </div>
                {fieldNames[field]}
              </label>

              <select
                value={formData[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all duration-300 hover:bg-white/25 hover:scale-105"
              >
                <option value="" className="text-gray-800">
                  Pilih kondisi {fieldNames[field].toLowerCase()}...
                </option>
                {opts.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-gray-800">
                    {opt.emoji} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || progressPercentage < 100}
          className="w-full mt-6 bg-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menganalisis mood kucing...
              </>
            ) : (
              <>
                <span className="text-2xl">🔮</span>
                Prediksi Mood Kucing
                <span className="text-2xl">✨</span>
              </>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </button>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p className="text-sm">Dibuat dengan ❤️ untuk para cat lovers</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CatMoodForm;