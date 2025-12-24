import React, { useEffect, useMemo, useState } from 'react';
import SubHeader from '../../components/dashboard/SubHeader';
import dashboardService from '../../services/dashboardService';

const FALLBACK_MP4 = '/cctv-dummy.mp4';
const MAX_CAMERAS = 5;

export default function CCTVPage() {
  const [kosList, setKosList] = useState([]);
  const [selectedKosId, setSelectedKosId] = useState('');
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);
  const [cameraForm, setCameraForm] = useState({
    name: '',
    stream_url: '',
    order: 1,
  });
  const [editingCamera, setEditingCamera] = useState(null);

  useEffect(() => {
    const loadKos = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getKos();
        const list = Array.isArray(data) ? data : [];
        setKosList(list);
        if (list.length > 0) {
          setSelectedKosId(String(list[0].id));
        }
      } catch (err) {
        console.error('Error fetching kos for CCTV:', err);
        setError('Gagal memuat daftar kos');
      } finally {
        setLoading(false);
      }
    };

    loadKos();
  }, []);

  useEffect(() => {
    const loadCameras = async () => {
      if (!selectedKosId) return;
      try {
        setLoading(true);
        const list = await dashboardService.getCctvCameras({ kos: selectedKosId });
        const arr = Array.isArray(list) ? list : [];
        setCameras(arr);
        setError('');
      } catch (err) {
        console.error('Error fetching cameras:', err);
        setError('Gagal memuat kamera');
      } finally {
        setLoading(false);
      }
    };

    loadCameras();
  }, [selectedKosId]);

  const handleAddCamera = async (e) => {
    e.preventDefault();
    try {
      await dashboardService.createCctvCamera({
        kos: selectedKosId,
        ...cameraForm,
      });
      // Refresh cameras list
      const list = await dashboardService.getCctvCameras({ kos: selectedKosId });
      setCameras(Array.isArray(list) ? list : []);
      setShowAddCameraModal(false);
      setCameraForm({ name: '', stream_url: '', order: 1 });
      setError('');
    } catch (err) {
      console.error('Error adding camera:', err);
      setError('Gagal menambahkan kamera');
    }
  };

  const handleUpdateCamera = async (e) => {
    e.preventDefault();
    try {
      await dashboardService.updateCctvCamera(editingCamera.id, cameraForm);
      // Refresh cameras list
      const list = await dashboardService.getCctvCameras({ kos: selectedKosId });
      setCameras(Array.isArray(list) ? list : []);
      setEditingCamera(null);
      setCameraForm({ name: '', stream_url: '', order: 1 });
      setError('');
    } catch (err) {
      console.error('Error updating camera:', err);
      setError('Gagal mengupdate kamera');
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamera ini?')) return;
    try {
      await dashboardService.deleteCctvCamera(cameraId);
      // Refresh cameras list
      const list = await dashboardService.getCctvCameras({ kos: selectedKosId });
      setCameras(Array.isArray(list) ? list : []);
      setError('');
    } catch (err) {
      console.error('Error deleting camera:', err);
      setError('Gagal menghapus kamera');
    }
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setCameraForm({
      name: camera.name,
      stream_url: camera.stream_url,
      order: camera.order,
    });
  };

  const selectedKos = useMemo(
    () => kosList.find((item) => String(item.id) === String(selectedKosId)),
    [kosList, selectedKosId]
  );

  const buildSrcDoc = (url) => {
    const sanitizedUrl = encodeURI(url || FALLBACK_MP4);
    return `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:#000;height:100%;}video{width:100%;height:100%;object-fit:cover;}</style></head><body><video src="${sanitizedUrl}" autoplay muted loop controls playsinline></video></body></html>`;
  };

  // Always display 5 frames: use existing cameras (up to 5) and fill with fallback dummy entries
  const displayCameras = useMemo(() => {
    const base = (cameras || []).slice(0, MAX_CAMERAS);
    const fillersNeeded = Math.max(0, MAX_CAMERAS - base.length);
    const fillers = Array.from({ length: fillersNeeded }).map((_, idx) => ({
      id: `dummy-${idx + 1}`,
      name: `Dummy Camera ${base.length + idx + 1}`,
      stream_url: FALLBACK_MP4,
      order: base.length + idx + 1,
      is_active: true,
    }));
    return [...base, ...fillers];
  }, [cameras]);

  if (loading && kosList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Memuat CCTV...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader title="CCTV Kos" backPath="/admin/fitur" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Pilih Kos untuk Dipantau</h1>
              </div>
              <div className="flex flex-col gap-2 w-full lg:w-80">
                <label className="text-sm font-medium text-gray-700">Pilih Kos</label>
                <select
                  value={selectedKosId}
                  onChange={(e) => setSelectedKosId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {kosList.map((kos) => (
                    <option key={kos.id} value={kos.id}>
                      {kos.name}
                    </option>
                  ))}
                </select>
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Live Preview</p>
                <h2 className="text-lg font-semibold text-gray-900">{selectedKos?.name || 'Belum ada kos terpilih'}</h2>
              </div>
              <button
                onClick={() => setShowAddCameraModal(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
              >
                + Tambah Kamera
              </button>
            </div>

            {/* Camera Management List */}
            {cameras.length > 0 && (
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Daftar Kamera ({cameras.length})</p>
                <div className="space-y-2">
                  {cameras.map((cam) => (
                    <div key={cam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{cam.name}</p>
                        <p className="text-xs text-gray-500 truncate">{cam.stream_url}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditCamera(cam)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCamera(cam.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Five CCTV frames, filled with real or dummy URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayCameras.map((cam, idx) => (
              <div key={cam.id || idx} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Kamera {idx + 1}</p>
                    <p className="text-sm font-semibold text-gray-900">{cam.name || `Dummy Camera ${idx + 1}`}</p>
                  </div>
                  <span className="text-[11px] text-gray-500">{cam.stream_url ? 'MP4 aktif' : 'Dummy'}</span>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    title={`CCTV frame ${idx + 1}`}
                    sandbox="allow-same-origin allow-scripts"
                    allow="autoplay; encrypted-media"
                    srcDoc={buildSrcDoc(cam.stream_url || FALLBACK_MP4)}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Camera Modal */}
        {showAddCameraModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Tambah Kamera CCTV</h2>
              <form onSubmit={handleAddCamera}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kamera</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kamera Depan, Lobby, dll"
                    value={cameraForm.name}
                    onChange={(e) => setCameraForm({ ...cameraForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Stream (MP4)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/stream.mp4"
                    value={cameraForm.stream_url}
                    onChange={(e) => setCameraForm({ ...cameraForm, stream_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Gunakan URL video MP4 untuk simulasi CCTV</p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampil</label>
                  <input
                    type="number"
                    min="1"
                    value={cameraForm.order}
                    onChange={(e) => setCameraForm({ ...cameraForm, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCameraModal(false);
                      setCameraForm({ name: '', stream_url: '', order: 1 });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Camera Modal */}
        {editingCamera && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Edit Kamera CCTV</h2>
              <form onSubmit={handleUpdateCamera}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kamera</label>
                  <input
                    type="text"
                    value={cameraForm.name}
                    onChange={(e) => setCameraForm({ ...cameraForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Stream (MP4)</label>
                  <input
                    type="url"
                    value={cameraForm.stream_url}
                    onChange={(e) => setCameraForm({ ...cameraForm, stream_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampil</label>
                  <input
                    type="number"
                    min="1"
                    value={cameraForm.order}
                    onChange={(e) => setCameraForm({ ...cameraForm, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCamera(null);
                      setCameraForm({ name: '', stream_url: '', order: 1 });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
