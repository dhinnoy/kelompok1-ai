import { useEffect, useState } from "react";
import { MainAPI } from "../services/MainAPI";
import AlertBox from "../components/AlertBox";
import CatMoodForm from "./CatMoodForm";

export default function LandingPage() {
  const [form, setForm] = useState({ question: "", answer: "" });
  const [kucingList, setKucingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const telingaMap = {
    0: "Menghadap Depan",
    5: "Menghadap Samping",
    10: "Rendah",
    15: "Tegak",
  };

  const ekorMap = {
    0: "Melengkung",
    5: "Melilit Tubuh",
    10: "Rendah",
    20: "Tegak Lurus",
  };

  const mataMap = {
    5: "Mata Lebar Dengan Pupil Membesar",
    10: "Menatap Tajam",
    15: "Pupil Mengecil",
    20: "Setengah Menutup",
    25: "Tertutup",
  };

  const posturMap = {
    0: "Berdiri",
    5: "Duduk",
    10: "Membungkuk",
    15: "Tidur",
  };

  const buluMap = {
    0: "Halus",
    10: "Naik",
    20: "Kusut",
  };

  const mulutMap = {
    0: "Sedikit Terbuka",
    5: "Terbuka Lebar",
    10: "Tertutup",
  };

  useEffect(() => {
    DataKucing();
  }, []);

  const DataKucing = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await MainAPI.fetchKucingJoin();
      setKucingList(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data kucing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <CatMoodForm onNewEntry={() => DataKucing()} />

      {error && <AlertBox type="error">{error}</AlertBox>}
      {success && <AlertBox type="success">{success}</AlertBox>}

      <table className="">
        <thead className="">
          <tr>
            <th>NO</th>
            <th>POSISI TELINGA</th>
            <th>POSISI EKOR</th>
            <th>KONDISI MATA</th>
            <th>POSTUR TUBUH</th>
            <th>KONDISI BULU</th>
            <th>KONDISI MULUT</th>
            <th>LABEL</th>
          </tr>
        </thead>
        <tbody>
          {kucingList.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{telingaMap[item.posisi_telinga] || item.posisi_telinga}</td>
              <td>{ekorMap[item.posisi_ekor] || item.posisi_ekor}</td>
              <td>{mataMap[item.kondisi_mata] || item.kondisi_mata}</td>
              <td>{posturMap[item.postur_tubuh] || item.postur_tubuh}</td>
              <td>{buluMap[item.kondisi_bulu] || item.kondisi_bulu}</td>
              <td>{mulutMap[item.kondisi_mulut] || item.kondisi_mulut}</td>
              <td>{item.Cluster?.label || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
