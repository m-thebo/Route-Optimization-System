import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const PerformanceChart = ({ results }) => {
  if (!results || Object.keys(results).length === 0) {
    return null;
  }

  // Prepare data for charts
  const distanceData = Object.entries(results)
    .filter(([_, result]) => result.success)
    .map(([algorithm, result]) => ({
      algorithm: algorithm.toUpperCase(),
      distance: result.total_distance,
      optimal: result.is_optimal_distance,
    }));

  const performanceData = Object.entries(results)
    .filter(([_, result]) => result.success)
    .map(([algorithm, result]) => ({
      algorithm: algorithm.toUpperCase(),
      'Execution Time (ms)': (result.execution_time * 1000).toFixed(2),
      'Nodes Explored': result.nodes_explored,
    }));

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Distance Comparison
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="algorithm" />
            <YAxis label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="distance" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="algorithm" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="Execution Time (ms)" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="Nodes Explored" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default PerformanceChart;
