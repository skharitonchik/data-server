import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Divider from '@mui/material/Divider';

async function loadDataFolderFiles() {
  const response = await fetch('/data');
  return await response.json();
}

export const DataFolderList = () => {
  const [files, setFiles] = useState([]);
  const { data, isSuccess } = useQuery({ queryKey: ['todos'], queryFn: loadDataFolderFiles });

  const openFile = (e: any) => {
    console.info('%c  SERGEY e.target', 'background: #222; color: #bada55', e.target.dataset);
    const { filename } = e.target.dataset;

    window.open(`/data/open/${filename}`, '_blank');
  };

  const downloadFile = (e: any) => {
    console.info('%c  SERGEY e.target', 'background: #222; color: #bada55', e.target.dataset);
    const { filename } = e.target.dataset;

    window.open(`/data/${filename}`, '_blank');
  };
  const uploadFile = () => {};

  useEffect(() => {
    if (isSuccess) {
      setFiles(data);
    }
  }, [data]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          <AttachFileIcon color="primary" sx={{ mr: 2 }} />
          './data' folder info card
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          files:
        </Typography>
        {files.map((f, i) => {
          return (
            <Box key={`${i}-${f}`} sx={{ display: 'flex', mb: 2 }}>
              <Typography variant="body2" sx={{ p: 1, minWidth: 250 }}>
                {f}
              </Typography>
              <Button data-filename={f} onClick={downloadFile}>
                Download
              </Button>
              <Button data-filename={f} onClick={openFile}>
                Open
              </Button>
              <Button data-filename={f} onClick={uploadFile}>
                Upload
              </Button>
            </Box>
          );
        })}
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};
