import { useState } from "react";
import { MainAPI } from "../services/MainAPI";
import { ClusterAPI } from "../services/ClusterAPI";

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
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Input Mood Kucing</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.entries(options).map(([field, opts]) => (
          <div key={field}>
            <label className="capitalize block font-medium mb-1">{field}</label>
            <select
              required
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Prediksi
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <strong>Prediksi Mood:</strong> {result}
        </div>
      )}
    </div>
  );
}
