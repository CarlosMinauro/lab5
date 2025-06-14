import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { cardService } from '../services/cardService';
import { Container, Typography, Button, Box, TextField, Alert } from '@mui/material';

const AddCard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({
    card_number: '',
    card_holder_name: '',
    expiry_date: '',
    brand: '',
    bank: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      card_number: '',
      card_holder_name: '',
      expiry_date: '',
      brand: '',
      bank: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation for required fields
    if (!form.card_number || !form.card_holder_name || !form.expiry_date) {
      setError('Please fill in all required fields: Card Number, Card Holder Name, and Expiry Date.');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando datos de tarjeta:', form);
      const response = await cardService.addCard({ ...form });
      console.log('Respuesta del servidor:', response);
      if (response.success) {
        console.log('Tarjeta agregada exitosamente');
        resetForm();
        navigate('/card-selection', { replace: true });
      } else {
        console.error('Error al agregar tarjeta:', response.message);
        setError(response.message || 'Error adding card');
      }
    } catch (err: any) {
      console.error('Error en la petición:', err);
      setError('Error adding card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Card
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Card Number"
          name="card_number"
          value={form.card_number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Card Holder Name"
          name="card_holder_name"
          value={form.card_holder_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Expiry Date (MM/YY)"
          name="expiry_date"
          value={form.expiry_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Bank"
          name="bank"
          value={form.bank}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Card'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/card-selection')}>
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddCard; 