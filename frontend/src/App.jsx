import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MedicationIcon from '@mui/icons-material/Medication';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteForm from './components/RouteForm';
import RouteMap from './components/RouteMap';
import ResultsDisplay from './components/ResultsDisplay';
import PerformanceChart from './components/PerformanceChart';
import apiService from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [singleResult, setSingleResult] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [cities, setCities] = useState([]);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await apiService.getHealth();
        setHealth(response.data);
      } catch (err) {
        setError('Unable to connect to backend. Please ensure the server is running.');
      }
    };

    const fetchCities = async () => {
      try {
        const response = await apiService.getCities();
        const citiesData = await Promise.all(
          response.data.map(async (cityName) => {
            try {
              const cityInfo = await apiService.getCityInfo(cityName);
              return { name: cityName, ...cityInfo.data };
            } catch {
              return { name: cityName };
            }
          })
        );
        setCities(citiesData);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };

    checkHealth();
    fetchCities();
  }, []);

  const handleSearch = async (start, goal, algorithm) => {
    setLoading(true);
    setError(null);
    setSingleResult(null);
    setComparisonResults(null);

    try {
      const response = await apiService.findRoute(start, goal, algorithm);
      setSingleResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while finding the route');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (start, goal) => {
    setLoading(true);
    setError(null);
    setSingleResult(null);
    setComparisonResults(null);

    try {
      const response = await apiService.compareAlgorithms(start, goal);
      setComparisonResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while comparing algorithms');
    } finally {
      setLoading(false);
    }
  };

  const algorithmColors = {
    bfs: '#e74c3c',
    dfs: '#27ae60',
    ucs: '#3498db',
    astar: '#9b59b6',
    dijkstra: '#e67e22',
    bidirectional: '#e91e63',
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{
        background: 'linear-gradient(135deg, #0066cc 0%, #004d99 100%)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <Toolbar sx={{ py: 1 }}>
          <MedicationIcon sx={{ fontSize: 40, mr: 2, color: '#fff' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: '#fff' }}>
              New Bhittai Logistics
            </Typography>
            <Typography variant="caption" sx={{ color: '#b3d9ff' }}>
              Pharmaceutical Distribution & Delivery Optimization
            </Typography>
          </Box>
          {health && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={<LocationOnIcon />}
                label={`${health.total_cities} Distribution Centers`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 600
                }}
              />
              <Chip
                label={`v${health.version}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#fff'
                }}
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Stats Cards */}
        {health && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #0066cc 0%, #004d99 100%)', color: '#fff' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {health.total_cities}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Distribution Centers
                      </Typography>
                    </Box>
                    <LocationOnIcon sx={{ fontSize: 50, opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: '#fff' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {health.status === 'healthy' ? '100%' : '0%'}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        System Uptime
                      </Typography>
                    </Box>
                    <SpeedIcon sx={{ fontSize: 50, opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: '#fff' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        6
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Route Algorithms
                      </Typography>
                    </Box>
                    <LocalShippingIcon sx={{ fontSize: 50, opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: '#fff' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Real-time
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Route Optimization
                      </Typography>
                    </Box>
                    <MedicationIcon sx={{ fontSize: 50, opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RouteForm onSearch={handleSearch} onCompare={handleCompare} loading={loading} />

            {health && (
              <Paper elevation={3} sx={{ p: 3, mt: 2, borderLeft: '4px solid #0066cc' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#0066cc', fontWeight: 600 }}>
                  <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Delivery Fleet Status
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Available Trucks
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
                      24 Active
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Routes Planned
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      156 Today
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Network Coverage
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0066cc' }}>
                      {health.total_cities} Cities
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      System Status
                    </Typography>
                    <Chip
                      label={health.status}
                      size="small"
                      sx={{
                        backgroundColor: '#27ae60',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            {loading && (
              <Paper elevation={3} sx={{ p: 8, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: '#0066cc' }} />
                <Typography variant="h6" sx={{ mt: 3, color: '#666' }}>
                  Calculating Optimal Delivery Route...
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
                  Analyzing routes for pharmaceutical distribution
                </Typography>
              </Paper>
            )}

            {singleResult && !loading && (
              <>
                <ResultsDisplay results={singleResult} />
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocalShippingIcon sx={{ mr: 1, color: '#0066cc' }} />
                    <Typography variant="h6" sx={{ color: '#0066cc', fontWeight: 600 }}>
                      Delivery Route Map
                    </Typography>
                  </Box>
                  <RouteMap
                    cities={cities}
                    route={singleResult.path}
                    color={algorithmColors[singleResult.algorithm] || '#0066cc'}
                    title={`${singleResult.algorithm.toUpperCase()} Route - ${singleResult.total_distance.toFixed(
                      2
                    )} km | Estimated Time: ${Math.round(singleResult.total_distance / 60)} hrs`}
                  />
                </Paper>
              </>
            )}

            {comparisonResults && !loading && (
              <>
                <ResultsDisplay results={comparisonResults} isComparison={true} />
                <PerformanceChart results={comparisonResults.results} />

                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <LocalShippingIcon sx={{ mr: 1, color: '#0066cc', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: '#0066cc', fontWeight: 600 }}>
                      Delivery Route Comparison
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {Object.entries(comparisonResults.results)
                      .filter(([_, result]) => result.success)
                      .map(([algorithm, result]) => (
                        <Grid item xs={12} md={6} key={algorithm}>
                          <Box sx={{ border: '2px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{
                              p: 1.5,
                              backgroundColor: algorithmColors[algorithm] || '#0066cc',
                              color: '#fff'
                            }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {algorithm.toUpperCase()} Algorithm
                              </Typography>
                              <Typography variant="caption">
                                {result.total_distance.toFixed(2)} km | Est: {Math.round(result.total_distance / 60)} hrs
                              </Typography>
                            </Box>
                            <RouteMap
                              cities={cities}
                              route={result.path}
                              color={algorithmColors[algorithm] || '#0066cc'}
                            />
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Paper>
              </>
            )}

            {!singleResult && !comparisonResults && !loading && (
              <Paper
                elevation={3}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 80, color: '#0066cc', mb: 2, opacity: 0.3 }} />
                <Typography variant="h5" sx={{ color: '#0066cc', fontWeight: 600, mb: 1 }}>
                  Plan Your Pharmaceutical Delivery Route
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Select origin and destination distribution centers, then choose an optimization algorithm
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Use "Compare All" to find the most efficient delivery route for your fleet
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{
        backgroundColor: '#0066cc',
        color: '#fff',
        py: 3,
        mt: 6,
        textAlign: 'center'
      }}>
        <Container maxWidth="xl">
          <Typography variant="body2">
            © New Bhittai Logistics - Pharmaceutical Distribution & Logistics Solutions
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Powered by Advanced Route Optimization AI | Serving {health?.total_cities || 61} Distribution Centers Nationwide
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
