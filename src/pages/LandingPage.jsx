import { useEffect, useState } from "react";
import { MainAPI } from "../services/MainAPI";
import AlertBox from "../components/AlertBox";
import CatMoodForm from "./CatMoodForm";

export default function LandingPage() {
  const [kucingList, setKucingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                              VALUE  TRANSLATORS                            */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                               DATA  FETCHING                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      {/* Limit width & center */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT  –  FORM */}
        {/* ------------------------------------------------------------------ */}
        <section className="">
          <CatMoodForm onNewEntry={fetchData} />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT  –  TABLE */}
        {/* ------------------------------------------------------------------ */}
         <div className="xl:col-span-3">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                  📊 Data Mood Kucing
                </h2>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
                  <table className="w-full text-sm text-white">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gradient-to-r from-yellow-400 to-orange-500">
                        <th className="px-4 py-3 text-center font-bold">NO</th>
                        <th className="px-4 py-3 text-center font-bold">TELINGA</th>
                        <th className="px-4 py-3 text-center font-bold">EKOR</th>
                        <th className="px-4 py-3 text-center font-bold">MATA</th>
                        <th className="px-4 py-3 text-center font-bold">POSTUR</th>
                        <th className="px-4 py-3 text-center font-bold">BULU</th>
                        <th className="px-4 py-3 text-center font-bold">MULUT</th>
                        <th className="px-4 py-3 text-center font-bold">MOOD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kucingList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-white/80">
                            <div className="text-4xl mb-2">🐾</div>
                            <div>Belum ada data mood kucing</div>
                          </td>
                        </tr>
                      ) : (
                        kucingList.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-b border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <td className="px-4 py-4 text-center font-semibold">
                              {index + 1}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {telingaMap[item.posisi_telinga] ?? item.posisi_telinga}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {ekorMap[item.posisi_ekor] ?? item.posisi_ekor}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {mataMap[item.kondisi_mata] ?? item.kondisi_mata}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {posturMap[item.postur_tubuh] ?? item.postur_tubuh}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {buluMap[item.kondisi_bulu] ?? item.kondisi_bulu}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {mulutMap[item.kondisi_mulut] ?? item.kondisi_mulut}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                item.Cluster?.label === 'Senang' ? 'bg-green-500' :
                                item.Cluster?.label === 'Sedih' ? 'bg-blue-500' :
                                'bg-purple-500'
                              }`}>
                                {item.Cluster?.label ?? "-"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}