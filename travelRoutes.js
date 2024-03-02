const express = require('express');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');

const router = express.Router();  // Add this line to create an instance of the router

// Модель и схема
const tourSchema = new mongoose.Schema({
  tour: String,
  hotel: String,
  carRental: String,
  arrivalDate: Date,
  departureDate: Date,
  adults: Number,
  children: Number,
  tourCost: Number,
  weather: String,
  timestamp: Date,
});

const Tour = mongoose.model('Tour', tourSchema);

// Расчет стоимости тура
const calculateTourCost = (destination, hotel, adults, children) => {
  const destinationCosts = {
    'Paris': 1000,
    'Rome': 1200,
    'Tokyo': 1500,
    'Bali': 800,
    'Cancun': 1200,
    'Astana': 1000,
  };

  const baseCost = destinationCosts[destination] || 1000;
  const hotelCost = 100 * adults;
  const childrenCost = 50 * children;

  return baseCost + hotelCost + childrenCost;
};

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'travelagency.html'));
});

router.post('/', async (req, res) => {
  try {
    const { tour, hotel, carRental, arrivalDate, departureDate, adults, children } = req.body;

    const weatherApiResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=89feff0f3b904daa98b82415241901&q=${tour}`);
    const tourCost = calculateTourCost(tour, hotel, adults, children);
    const weather = weatherApiResponse.data.current.condition.text;
    const timestamp = new Date();

    const newTour = new Tour({
      tour,
      hotel,
      carRental,
      arrivalDate,
      departureDate,
      adults,
      children,
      tourCost,
      weather,
      timestamp,
    });

    await newTour.save();

    console.log('Tour saved to MongoDB');
    res.redirect('/history.html');
  } catch (error) {
    console.error('Error saving tour to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/history', async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.send({ history: tours });
  } catch (error) {
    console.error('Error fetching tour history from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.delete('/:tourId', async (req, res) => {
  const { tourId } = req.params;

  try {
     await Tour.findByIdAndDelete(tourId);

    console.log('Tour deleted from MongoDB');
    res.send({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
