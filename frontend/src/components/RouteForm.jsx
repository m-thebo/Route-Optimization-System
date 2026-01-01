import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import RouteIcon from '@mui/icons-material/Route';
import apiService from '../services/api';

const RouteForm = ({ onSearch, onCompare, loading }) => {
  const [cities, setCities] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [startCity, setStartCity] = useState('');
  const [goalCity, setGoalCity] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('astar');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, algorithmsRes] = await Promise.all([
          apiService.getCities(),
          apiService.getAvailableAlgorithms(),
        ]);
        setCities(citiesRes.data);
        setAlgorithms(algorithmsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (startCity && goalCity) {
      onSearch(startCity, goalCity, selectedAlgorithm);
    }
  };

  const handleCompare = () => {
    if (startCity && goalCity) {
      onCompare(startCity, goalCity);
    }
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress sx={{ color: '#0066cc' }} />
      </Box>
    );
  }

  const algorithmLabels = {
    bfs: 'BFS - Breadth First (Fast)',
    dfs: 'DFS - Depth First',
    ucs: 'UCS - Uniform Cost (Optimal)',
    astar: 'A* - Smart Route (Recommended)',
    dijkstra: 'Dijkstra - Shortest Path',
    bidirectional: 'Bidirectional - Two-Way Search'
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderTop: '4px solid #0066cc' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <RouteIcon sx={{ mr: 1, color: '#0066cc' }} />
        <Typography variant="h6" sx={{ color: '#0066cc', fontWeight: 600 }}>
          Delivery Route Planner
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexDirection="column" gap={2.5}>
        <Autocomplete
          options={cities}
          value={startCity}
          onChange={(event, newValue) => setStartCity(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Origin Distribution Center"
              placeholder="Select warehouse or pharmacy"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#0066cc',
                  },
                },
              }}
            />
          )}
          fullWidth
        />

        <Autocomplete
          options={cities}
          value={goalCity}
          onChange={(event, newValue) => setGoalCity(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Destination Distribution Center"
              placeholder="Select delivery location"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#0066cc',
                  },
                },
              }}
            />
          )}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel sx={{ '&.Mui-focused': { color: '#0066cc' } }}>
            Route Optimization Algorithm
          </InputLabel>
          <Select
            value={selectedAlgorithm}
            label="Route Optimization Algorithm"
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0066cc',
              },
            }}
          >
            {algorithms.map((algo) => (
              <MenuItem key={algo} value={algo}>
                {algorithmLabels[algo] || algo.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2} mt={1}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!startCity || !goalCity || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LocalShippingIcon />}
            fullWidth
            sx={{
              backgroundColor: '#0066cc',
              '&:hover': {
                backgroundColor: '#004d99',
              },
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Plan Delivery Route
          </Button>

          <Button
            variant="outlined"
            onClick={handleCompare}
            disabled={!startCity || !goalCity || loading}
            startIcon={<CompareArrowsIcon />}
            fullWidth
            sx={{
              borderColor: '#0066cc',
              color: '#0066cc',
              '&:hover': {
                borderColor: '#004d99',
                backgroundColor: 'rgba(0, 102, 204, 0.04)',
              },
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Compare Routes
          </Button>
        </Box>

        <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', mt: 1 }}>
          Select distribution centers and algorithm to optimize your pharmaceutical delivery route
        </Typography>
      </Box>
    </Paper>
  );
};

export default RouteForm;
