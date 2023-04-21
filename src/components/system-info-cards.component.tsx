import Grid from '@mui/material/Grid';
import { TemperatureInfo } from './temperature-info-card.component';
import { MemoryInfoCard } from './memory-info-card.component';
import { CPUInfoCard } from './cpu-info-card.component';

export const SystemInfoCards = () => {
  return (
    <Grid sx={{ pt: 20, pb: 2 }} container spacing={2}>
      <Grid item xs={4}>
        <CPUInfoCard />
      </Grid>
      <Grid item xs={4}>
        <TemperatureInfo />
      </Grid>
      <Grid item xs={4}>
        <MemoryInfoCard />
      </Grid>
    </Grid>
  );
};
