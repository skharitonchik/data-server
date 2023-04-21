import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { theme } from './common';
import { SystemInfoCards, FoldersInfoCards } from './components';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Container sx={{ height: '100vh' }} maxWidth="xl">
            <SystemInfoCards />
            <FoldersInfoCards />
          </Container>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
