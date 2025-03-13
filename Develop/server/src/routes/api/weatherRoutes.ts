import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const cityName = req.body.cityName;
  WeatherService.getWeatherForCity(cityName)
    .then((weatherData) => {
      res.status(200).json(weatherData);
      return HistoryService.addCity(cityName);
    }
    )
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
    );
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;
  try {
    await HistoryService.removeCity(cityId);
    res.status(200).json({ message: 'City removed from search history' });
  } catch (error) {
    console.error('Error removing city from search history:', error);
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
