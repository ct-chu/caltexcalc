'use client'

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Icon,
} from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const Home: NextPage = () => {
  const [oilQty, setOilQty] = useState<number | null>(null);
  const [totalPriceBeforeDiscount, setTotalPriceBeforeDiscount] = useState<number | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [pumpPrice, setPumpPrice] = useState<number | string>(26.84);
  const [cardDiscountPerLiter, setCardDiscountPerLiter] = useState<number | string>(7.5);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [finalPricePerLiter, setFinalPricePerLiter] = useState<number | null>(null);
  const [error, setError] = useState<string | null>('');

  useEffect(() => {
    const fetchPumpPrice = async () => {
      try {
        const response = await fetch('https://oil-price.consumer.org.hk/en/today-discount');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const targetRow = Array.from(htmlDoc.querySelectorAll('table tr')).find(row =>
          row.textContent?.includes('Caltex-Gold with Techron® (Standard Petrol)')
        );

        if (targetRow) {
          const priceCell = targetRow.querySelector('td:nth-child(2)');
          const priceText = priceCell?.textContent?.trim();
          if (priceText) {
            setPumpPrice(parseFloat(priceText));
          }
        }
      } catch (error) {
        console.error('Error fetching pump price:', error);
        // Fallback to the initial value if fetching fails
      }
    };

    fetchPumpPrice();
  }, []);

  const calculateFinalPrice = () => {
    if (oilQty === null || totalPriceBeforeDiscount === null || couponDiscount === null || typeof pumpPrice !== 'number' || typeof cardDiscountPerLiter !== 'number') {
      setError('Incomplete or Invalid input');
      setFinalPrice(null);
      setFinalPricePerLiter(null);
      return;
    }

    if (oilQty <= 0 || totalPriceBeforeDiscount < 0 || couponDiscount < 0) {
      setError('Incomplete or Invalid input');
      setFinalPrice(null);
      setFinalPricePerLiter(null);
      return;
    }

    setError('');
    const priceAfterCoupon = totalPriceBeforeDiscount - couponDiscount;
    const calculatedFinalPrice = priceAfterCoupon - (priceAfterCoupon / pumpPrice) * cardDiscountPerLiter;
    const calculatedFinalPricePerLiter = calculatedFinalPrice / oilQty;

    setFinalPrice(calculatedFinalPrice);
    setFinalPricePerLiter(calculatedFinalPricePerLiter);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#2e3440', // A darker background to contrast the text
        padding: 1,
        color: '#d8dee9', // Default text color
      }}
    >
      <Typography sx={{ fontSize: "2rem", color: "#ebcb8b", margin: 0}} component="h1" gutterBottom align="center">
        Caltex StarCard <br /> Oil Price Calculator
      </Typography>
      <Box
        sx={{
          padding: 1,
        }}
      >
        <LocalGasStationIcon sx={{ fontSize: "5rem", color: "#ebcb8b"}} />
      </Box>
      <Box
        sx={{
          width: '100%',
          bgcolor: '#434c5e',
          padding: 2,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          fullWidth
          label="Oil Qty (L)"
          type="number"
          margin="normal"
          size="small"
          value={oilQty !== null ? oilQty : ''}
          onChange={(e) => setOilQty(e.target.value === '' ? null : parseFloat(e.target.value))}
          inputProps={{ style: { color: '#d8dee9', '-moz-appearance': 'textfield' } } as any}
          InputLabelProps={{ style: { color: '#d8dee9' } }}
        />
        <TextField
          fullWidth
          label="Total price before discount"
          type="number"
          margin="normal"
          size="small"
          value={totalPriceBeforeDiscount !== null ? totalPriceBeforeDiscount : ''}
          onChange={(e) => setTotalPriceBeforeDiscount(e.target.value === '' ? null : parseFloat(e.target.value))}
          inputProps={{ style: { color: '#d8dee9', '-moz-appearance': 'textfield' } } as any}
          InputLabelProps={{ style: { color: '#d8dee9' } }}
        />
        <TextField
          fullWidth
          label="Discount from coupon"
          type="number"
          margin="normal"
          size="small"
          value={couponDiscount !== null ? couponDiscount : ''}
          onChange={(e) => setCouponDiscount(e.target.value === '' ? null : parseFloat(e.target.value))}
          inputProps={{ style: { color: '#d8dee9', '-moz-appearance': 'textfield' } } as any}
          InputLabelProps={{ style: { color: '#d8dee9' } }}
        />
        <TextField
          fullWidth
          label="Pump Price"
          type="number"
          margin="normal"
          value={pumpPrice}
          onChange={(e) => setPumpPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
          inputProps={{ style: { color: '#d8dee9', '-moz-appearance': 'textfield' } } as any}
          InputLabelProps={{ style: { color: '#d8dee9' } }}
        />
        <TextField
          fullWidth
          label="Card discount /L"
          type="number"
          margin="normal"
          size="small"
          value={cardDiscountPerLiter}
          onChange={(e) => setCardDiscountPerLiter(e.target.value === '' ? '' : parseFloat(e.target.value))}
          inputProps={{ style: { color: '#d8dee9', '-moz-appearance': 'textfield' } } as any}
          InputLabelProps={{ style: { color: '#d8dee9' } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={calculateFinalPrice}
          sx={{ marginTop: 2, color: '#d8dee9', bgcolor: '#5e81ac', '&:hover': { bgcolor: '#81a1c1' } }}
        >
          Calculate
        </Button>

        {error && (
          <Alert severity="error" sx={{ marginTop: 2, color: '#d8dee9', bgcolor: '#bf616a' }}>
            {error}
          </Alert>
        )}

        {finalPrice !== null && finalPricePerLiter !== null && (
          <Box mt={3} sx={{ color: '#d8dee9' }}>
            <Typography variant="h6">Final Price: ${finalPrice.toFixed(2)}</Typography>
            <Typography variant="h6">Final Price /L: ${finalPricePerLiter.toFixed(3)}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;