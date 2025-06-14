import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AddCard from '../../pages/AddCard';
import { cardService } from '../../services/cardService';

// Mock the cardService
jest.mock('../../services/cardService', () => ({
  cardService: {
    addCard: jest.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe('AddCard Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { id: '1', email: 'test@example.com' },
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <AddCard />
        </BrowserRouter>
      </Provider>
    );
  };

  describe('Happy Paths', () => {
    it('should successfully add a card with all required fields', async () => {
      const mockResponse = { success: true };
      (cardService.addCard as jest.Mock).mockResolvedValueOnce(mockResponse);

      renderComponent();

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4111111111111111' },
      });
      fireEvent.change(screen.getByLabelText(/card holder name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/expiry date/i), {
        target: { value: '12/25' },
      });
      fireEvent.change(screen.getByLabelText(/brand/i), {
        target: { value: 'Visa' },
      });
      fireEvent.change(screen.getByLabelText(/bank/i), {
        target: { value: 'Chase' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/add card/i));

      await waitFor(() => {
        expect(cardService.addCard).toHaveBeenCalledWith({
          card_number: '4111111111111111',
          card_holder_name: 'John Doe',
          expiry_date: '12/25',
          brand: 'Visa',
          bank: 'Chase',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/card-selection', { replace: true });
      });
    });
  });

  describe('Unhappy Paths', () => {
    it('should show error when required fields are empty', async () => {
      renderComponent();

      // Try to submit without filling required fields
      fireEvent.click(screen.getByText(/add card/i));

      // Check if form validation prevents submission
      expect(cardService.addCard).not.toHaveBeenCalled();
    });

    it('should show error message when server returns an error', async () => {
      const mockError = { success: false, message: 'Invalid card number' };
      (cardService.addCard as jest.Mock).mockResolvedValueOnce(mockError);

      renderComponent();

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4111111111111111' },
      });
      fireEvent.change(screen.getByLabelText(/card holder name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/expiry date/i), {
        target: { value: '12/25' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/add card/i));

      await waitFor(() => {
        expect(screen.getByText('Invalid card number')).toBeInTheDocument();
      });
    });

    it('should show error message when network request fails', async () => {
      (cardService.addCard as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4111111111111111' },
      });
      fireEvent.change(screen.getByLabelText(/card holder name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/expiry date/i), {
        target: { value: '12/25' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/add card/i));

      await waitFor(() => {
        expect(screen.getByText('Error adding card')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to card selection when cancel button is clicked', () => {
      renderComponent();
      
      fireEvent.click(screen.getByText(/cancel/i));
      
      expect(mockNavigate).toHaveBeenCalledWith('/card-selection');
    });
  });
}); 