import { useState } from "react";
import { MainAPI } from "../services/MainAPI";

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

export default function CatMoodForm() {
  const [formData, setFormData] = useState({
    telinga: "",
    ekor: "",
    mata: "",
    postur: "",
    bulu: "",
    mulut: "",
  });
  const [result, setResult] = useState("");

  const predictMood = async (input) => {
    try {
      const data = await MainAPI.fetchKucingJoin();
      // console.log('Data dari Supabase:', data);
      // if (!data?.length) {
      //   console.warn('Belum ada data di DB!');
      // }
      console.log("Contoh data Supabase:", data[0]);

      let closest = null;
      let minDist = Infinity;

      for (const row of data) {
        const dist =
          Math.abs(row.posisi_telinga - input.telinga) +
          Math.abs(row.posisi_ekor - input.ekor) +
          Math.abs(row.kondisi_mata - input.mata) +
          Math.abs(row.postur_tubuh - input.postur) +
          Math.abs(row.kondisi_bulu - input.bulu) +
          Math.abs(row.kondisi_mulut - input.mulut);

        if (dist < minDist) {
          minDist = dist;
          closest = row.Cluster?.label;
        }
      }

      return closest || "Tidak ditemukan";
    } catch (error) {
      console.error("Error saat memprediksi mood:", error);
      return "Terjadi kesalahan";
    }
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

    // if (Object.values(numericInput).some((val) => isNaN(val))) {
    //   alert("Pastikan semua input sudah dipilih!");
    //   return;
    // }

    const label = await predictMood(numericInput);
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
