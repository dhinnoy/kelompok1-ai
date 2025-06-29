import { FaPaw } from "react-icons/fa"; 
import { useState } from "react";
import { MainAPI } from "../services/MainAPI";
import { ClusterAPI } from "../services/ClusterAPI";
import "tailwindcss";

const options = {
  telinga: [
    { label: "Menghadap Depan", value: 0 },
    { label: "Menghadap Samping", value: 5 },
    { label: "Rendah", value: 10 },
    { label: "Tegak", value: 15 },
  ],
  ekor: [
    { label: "Melengkung", value: 0 },
    { label: "Melilit Tubuh", value: 5 },
    { label: "Rendah", value: 10 },
    { label: "Tegak Lurus", value: 20 },
  ],
  mata: [
    { label: "Mata Lebar dengan Pupil Membesar", value: 5 },
    { label: "Menatap Tajam", value: 10 },
    { label: "Pupil Mengecil", value: 15 },
    { label: "Setengah Menutup", value: 20 },
    { label: "Tertutup", value: 25 },
  ],
  postur: [
    { label: "Berdiri", value: 0 },
    { label: "Duduk", value: 5 },
    { label: "Membungkuk", value: 10 },
    { label: "Tidur", value: 15 },
  ],
  bulu: [
    { label: "Halus", value: 0 },
    { label: "Naik", value: 10 },
    { label: "Kusut", value: 20 },
  ],
  mulut: [
    { label: "Tertutup", value: 0 },
    { label: "Sedikit Terbuka", value: 5 },
    { label: "Terbuka Lebar", value: 10 },
  ],
};

export default function CatMoodForm({ onNewEntry }) {
  const [formData, setFormData] = useState({
    telinga: "",
    ekor: "",
    mata: "",
    postur: "",
    bulu: "",
    mulut: "",
  });
  const [result, setResult] = useState("");

  function euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
  }

  function kMeans(data, k = 4, maxIter = 100) {
    const n = data.length;
    const dim = data[0].length;

    let centroids = data.slice(0, k).map((d) => [...d]);
    let labels = new Array(n).fill(0);

    for (let iter = 0; iter < maxIter; iter++) {
      let changed = false;

      for (let i = 0; i < n; i++) {
        const distances = centroids.map((c) => euclideanDistance(data[i], c));
        const newLabel = distances.indexOf(Math.min(...distances));
        if (labels[i] !== newLabel) changed = true;
        labels[i] = newLabel;
      }

      const newCentroids = Array.from({ length: k }, () => Array(dim).fill(0));
      const counts = Array(k).fill(0);
      for (let i = 0; i < n; i++) {
        const label = labels[i];
        counts[label]++;
        for (let j = 0; j < dim; j++) newCentroids[label][j] += data[i][j];
      }
      for (let i = 0; i < k; i++) {
        if (counts[i] > 0) {
          for (let j = 0; j < dim; j++) newCentroids[i][j] /= counts[i];
        }
      }

      centroids = newCentroids;
      console.log("centroids", centroids);
      if (!changed) break;
    }

    return { centroids, labels };
  }

  const predictMood = async (input) => {
    try {
      const data = await MainAPI.fetchKucingJoin();

      const vectors = data.map((row) => [
        row.posisi_telinga,
        row.posisi_ekor,
        row.kondisi_mata,
        row.postur_tubuh,
        row.kondisi_bulu,
        row.kondisi_mulut,
      ]);

      const inputVector = [
        input.telinga,
        input.ekor,
        input.mata,
        input.postur,
        input.bulu,
        input.mulut,
      ];

      let closest = null;
      let minDist = Infinity;

      for (let i = 0; i < data.length; i++) {
        const dist = inputVector.reduce(
          (sum, val, j) => sum + Math.abs(val - vectors[i][j]),
          0
        );
        if (dist < minDist) {
          minDist = dist;
          closest = data[i].Cluster?.label;
        }
      }

      if (minDist <= 5 && closest) return closest;

      const extendedVectors = [...vectors, inputVector];
      const { labels } = kMeans(extendedVectors, 7);

      const inputCluster = labels[labels.length - 1];
      console.log(inputCluster);
      const clusterTable = await ClusterAPI.fetchCluster();
      const matched = clusterTable.find((c) => c.clusterPoint === inputCluster);

      return (
        matched?.label || `Cluster ${inputCluster} (label tidak ditemukan)`
      );
    } catch (error) {
      console.error("Error saat memprediksi mood:", error);
      return "Terjadi kesalahan";
    }
  };

  const getClusterIdByLabel = async (label) => {
    const clusters = await ClusterAPI.fetchCluster();
    const match = clusters.find((c) => c.label === label);
    return match?.id ?? null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericInput = {
      telinga: parseInt(formData.telinga),
      ekor: parseInt(formData.ekor),
      mata: parseInt(formData.mata),
      postur: parseInt(formData.postur),
      bulu: parseInt(formData.bulu),
      mulut: parseInt(formData.mulut),
    };

    const label = await predictMood(numericInput);
    const clusterId = await getClusterIdByLabel(label);

    await MainAPI.createKucing({
      posisi_telinga: numericInput.telinga,
      posisi_ekor: numericInput.ekor,
      kondisi_mata: numericInput.mata,
      postur_tubuh: numericInput.postur,
      kondisi_bulu: numericInput.bulu,
      kondisi_mulut: numericInput.mulut,
      cluster_id: clusterId,
    });

    if (onNewEntry) onNewEntry();
    setResult(label);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-100 overflow-hidden">
      {/* Wave background atas */}
      <div className="absolute top-0 left-0 w-full h-32 z-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0H1440V60C1200 120 800 0 0 60V0Z" fill="#FFB74D"/>
        </svg>
      </div>
      {/* Paw dekorasi */}
      <FaPaw className="absolute right-24 top-40 text-orange-300 opacity-50 -rotate-12 z-0" size={32} />
      <FaPaw className="absolute left-24 bottom-32 text-orange-300 opacity-40 rotate-6 z-0" size={36} />
      {/* Wave background bawah */}
      <div className="absolute bottom-0 left-0 w-full h-32 z-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 60C400 0 1200 120 1440 60V120H0V60Z" fill="#FFB74D"/>
        </svg>
      </div>
      {/* Form utama */}
      <div className="relative z-10 bg-white/90 rounded-3xl shadow-2xl px-8 py-10 max-w-md w-full">
        <div className="flex flex-col items-center mb-2">
          {/* <CatIcon size="60px" color="#FF9800" /> */}
        </div>
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-1 tracking-wide">Input Mood Kucing</h2>
        <p className="text-orange-400 text-center mb-6 flex items-center justify-center gap-2">
          <FaPaw color="#FFA500" className="inline-block" />
          Yuk, prediksi suasana hati kucingmu!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(options).map(([field, opts]) => (
            <div key={field}>
              <label className="flex items-center font-semibold text-orange-500 mb-1">
                <FaPaw color="#FFA500" className="mr-2" />
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <select
                required
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
              >
                <option value="">Pilih {field}</option>
                {opts.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow hover:scale-105 hover:from-orange-500 hover:to-orange-400 transition"
          >
            <FaPaw className="mr-1" />
            Prediksi
          </button>
        </form>
        {result && (
          <div className="mt-6 bg-orange-50 text-orange-600 rounded-lg px-4 py-3 text-center font-semibold shadow">
            <strong>Prediksi Mood:</strong> {result}
          </div>
        )}
      </div>
    </div>
  );
}