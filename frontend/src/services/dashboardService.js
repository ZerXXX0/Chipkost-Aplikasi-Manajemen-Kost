import api from './api';

/**
 * Dashboard Service - Fetch data from Django backend for dashboard display
 */

const dashboardService = {
  /**
   * Get all users (Admin only)
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/auth/users/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; // Return empty array on error to prevent breaking the UI
    }
  },

  /**
   * Get all rooms (Kamar)
   */
  getRooms: async (params = {}) => {
    try {
      const response = await api.get('/kamar/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get room by ID
   */
  getRoomById: async (id) => {
    try {
      const response = await api.get(`/kamar/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  /**
   * Get all invoices (Pembayaran/Invoice)
   */
  getInvoices: async (params = {}) => {
    try {
      const response = await api.get('/invoice/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get invoice by ID
   */
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoice/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  /**
   * Get all complaints/damages (Kerusakan)
   */
  getComplaints: async (params = {}) => {
    try {
      const response = await api.get('/kerusakan/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get complaint by ID
   */
  getComplaintById: async (id) => {
    try {
      const response = await api.get(`/kerusakan/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  },

  /**
   * Get all rentals (Penyewaan)
   */
  getRentals: async (params = {}) => {
    try {
      const response = await api.get('/rental/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching rentals:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get rental by ID
   */
  getRentalById: async (id) => {
    try {
      const response = await api.get(`/rental/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rental:', error);
      throw error;
    }
  },

  /**
   * Get all Kos (boarding houses)
   */
  getKos: async (params = {}) => {
    try {
      const response = await api.get('/kos/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching kos:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get Kos by ID
   */
  getKosById: async (id) => {
    try {
      const response = await api.get(`/kos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kos:', error);
      throw error;
    }
  },

  /**
   * Get financial reports (Laporan Keuangan)
   */
  getFinancialReports: async (params = {}) => {
    try {
      const response = await api.get('/laporan-keuangan/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get notifications (Notifikasi)
   */
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifikasi/', { params });
      // Normalize response - return array if paginated object
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Get current user's assigned room (for penyewa)
   */
  getMyRoom: async () => {
    try {
      const response = await api.get('/kamar/my-room/');
      return response.data;
    } catch (error) {
      console.error('Error fetching my room:', error);
      return null;
    }
  },

  /**
   * Get current user's rental info with end date (for penyewa)
   */
  getMyRentalInfo: async () => {
    try {
      const response = await api.get('/pembayaran/rental-info/');
      return response.data;
    } catch (error) {
      console.error('Error fetching rental info:', error);
      return null;
    }
  },

  /**
   * CCTV Cameras per Kos
   */
  getCctvCameras: async (params = {}) => {
    try {
      const response = await api.get('/cctv/', { params });
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error('Error fetching CCTV cameras:', error);
      return [];
    }
  },

  createCctvCamera: async (payload) => {
    const response = await api.post('/cctv/', payload);
    return response.data;
  },

  updateCctvCamera: async (id, payload) => {
    const response = await api.put(`/cctv/${id}/`, payload);
    return response.data;
  },

  deleteCctvCamera: async (id) => {
    await api.delete(`/cctv/${id}/`);
  },
};

export default dashboardService;
