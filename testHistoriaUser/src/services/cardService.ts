import api from './api';

interface Card {
  id: number;
  user_id: number;
  card_number: string;
  expiry_date: string;
  card_holder_name: string;
  brand?: string;
  bank?: string;
  is_active?: boolean;
  created_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const cardService = {
  getCards: async (): Promise<ApiResponse<Card[]>> => {
    try {
      console.log('Obteniendo tarjetas...');
      const response = await api.get('/api/cards');
      console.log('Respuesta de tarjetas:', response.data);
      return { success: true, data: response.data.cards };
    } catch (error: any) {
      console.error('Error al obtener tarjetas:', error);
      return { success: false, message: error.response?.data?.message || 'Error fetching cards' };
    }
  },
  addCard: async (cardData: any) => {
    // This is a mock implementation that will be overridden in tests
    return { success: true };
  },
  // Add other card-related API calls here (e.g., updateCard, deleteCard)
}; 