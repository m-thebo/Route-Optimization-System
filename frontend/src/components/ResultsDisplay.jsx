import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { CheckCircle, Cancel, Speed, Route, Explore } from '@mui/icons-material';

const ResultsDisplay = ({ results, isComparison = false }) => {
  if (!results) return null;

  const formatTime = (seconds) => `${(seconds * 1000).toFixed(2)} ms`;
  const formatDistance = (km) => `${km.toFixed(2)} km`;

  if (!isComparison) {
    // Single result display
    const { algorithm, path, total_distance, execution_time, nodes_explored, success, error } = results;

    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{algorithm.toUpperCase()} Results</Typography>
          {success ? (
            <Chip icon={<CheckCircle />} label="Success" color="success" />
          ) : (
            <Chip icon={<Cancel />} label="Failed" color="error" />
          )}
        </Box>

        {success ? (
          <Box>
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
              <Chip icon={<Route />} label={`Distance: ${formatDistance(total_distance)}`} />
              <Chip icon={<Speed />} label={`Time: ${formatTime(execution_time)}`} />
              <Chip icon={<Explore />} label={`Nodes: ${nodes_explored}`} />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Path ({path.length} cities):
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {path.join(' → ')}
            </Typography>
          </Box>
        ) : (
          <Typography color="error">{error}</Typography>
        )}
      </Paper>
    );
  }

  // Comparison display
  const successfulResults = Object.entries(results.results).filter(([_, r]) => r.success);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Algorithm Comparison
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Algorithm</TableCell>
              <TableCell align="right">Distance</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Nodes</TableCell>
              <TableCell align="center">Badges</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {successfulResults.map(([algorithm, result]) => (
              <TableRow key={algorithm}>
                <TableCell component="th" scope="row">
                  <strong>{algorithm.toUpperCase()}</strong>
                </TableCell>
                <TableCell align="right">{formatDistance(result.total_distance)}</TableCell>
                <TableCell align="right">{formatTime(result.execution_time)}</TableCell>
                <TableCell align="right">{result.nodes_explored}</TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    {result.is_optimal_distance && (
                      <Chip label="Optimal" color="success" size="small" />
                    )}
                    {result.is_fastest && <Chip label="Fastest" color="primary" size="small" />}
                    {result.is_most_efficient && (
                      <Chip label="Efficient" color="secondary" size="small" />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ResultsDisplay;
