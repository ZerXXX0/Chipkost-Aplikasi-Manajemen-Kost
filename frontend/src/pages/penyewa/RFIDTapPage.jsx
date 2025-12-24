import React, { useEffect, useState } from 'react';
import SubHeader from '../../components/dashboard/SubHeader';
import api from '../../services/api';
import dashboardService from '../../services/dashboardService';

export default function RFIDTapPage() {
  const [cards, setCards] = useState([]);
  const [logs, setLogs] = useState([]);
  const [room, setRoom] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [cardsRes, logsRes, myRoom] = await Promise.all([
          api.get('/rfid/'),
          api.get('/access-logs/'),
          dashboardService.getMyRoom(),
        ]);

        const cardList = Array.isArray(cardsRes.data) ? cardsRes.data : cardsRes.data?.results || [];
        const logList = Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.results || [];
        setCards(cardList);
        setLogs(logList);
        if (myRoom) {
          setRoom(myRoom);
          setRoomId(String(myRoom.id));
        }
      } catch (err) {
        console.error('Error loading RFID data:', err);
        setError('Gagal memuat data RFID.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;

    const primaryCard = cards.find((c) => c.status === 'active') || cards[0];
    const cid = primaryCard.card_id || primaryCard.card_uid || '';

    setSelectedCardId((prev) => {
      const stillExists = cards.some((c) => (c.card_id || c.card_uid || '') === prev);
      return prev && stillExists ? prev : cid;
    });

    setRoomId((prev) => {
      if (prev) return prev;
      if (primaryCard.room) return String(primaryCard.room);
      return prev;
    });
  }, [cards]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError('');
    try {
      const response = await api.post('/rfid/tap/', {
        card_id: selectedCardId,
        room_id: parseInt(roomId, 10),
      });
      setResult({ success: true, ...response.data });
      const logsRes = await api.get('/access-logs/');
      const logList = Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.results || [];
      setLogs(logList);
    } catch (err) {
      const msg = err.response?.data?.message || 'Akses ditolak';
      setResult({ success: false, status: err.response?.data?.status || 'denied', message: msg, card_id: selectedCardId });
      const logsRes = await api.get('/access-logs/');
      const logList = Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.results || [];
      setLogs(logList);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data RFID...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SubHeader title="Simulasi Tap RFID" backPath="/penyewa/fitur" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tap Kartu Anda</h1>
          <p className="text-gray-600 text-sm mb-4">Simulasikan tap kartu untuk masuk. Log akan tercatat di panel admin.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card ID</label>
                {cards.length === 0 ? (
                  <p className="text-sm text-red-600">Anda belum memiliki kartu RFID. Hubungi admin/pemilik untuk mendaftarkan.</p>
                ) : (
                  <>
                    <select
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    >
                      {cards.map((c) => (
                        <option key={c.id} value={c.card_id || c.card_uid || ''}>
                          {c.card_id || c.card_uid} {c.status !== 'active' ? '(tidak aktif)' : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Kartu otomatis tersinkron dari pendaftaran admin/pemilik.</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kamar</label>
                <input
                  type="text"
                  value={room?.room_number ? `Kamar ${room.room_number}` : ''}
                  readOnly
                  placeholder="Kamar Anda"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                />
                <input type="hidden" value={roomId} onChange={() => {}} />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !selectedCardId || !roomId || cards.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Memproses...' : 'Tap Sekarang'}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="font-semibold mb-1">{result.message}</p>
              <p className="text-sm">Card: {result.card_id}</p>
              {result.room_number && <p className="text-sm">Kamar: {result.room_number}</p>}
              {result.kos_name && <p className="text-sm">Kos: {result.kos_name}</p>}
              {result.warning && <p className="text-sm text-yellow-700">{result.warning}</p>}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Tap Anda</h2>
            <span className="text-xs text-gray-500">Log ini juga terlihat di panel admin.</span>
          </div>

          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada log tap.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Waktu</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Card</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Kamar</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-2 text-gray-700">{formatDate(log.access_time)}</td>
                      <td className="px-4 py-2 font-mono text-gray-800">{log.card_id || log.attempted_card_id || '-'}</td>
                      <td className="px-4 py-2 text-gray-700">Kamar {log.room_number}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {log.status === 'granted' ? 'Diizinkan' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{log.denied_reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
