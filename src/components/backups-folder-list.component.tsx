import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import BackupIcon from '@mui/icons-material/Backup';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { useLoadBackupsFolder } from '../hooks';
import { BASE_URL } from '../common';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

export const BackupsFolderList = () => {
  const [files, setFiles] = useState([]);
  const { backupFolderFiles, isLoadBackupFolderFilesSuccess } = useLoadBackupsFolder();
  const createBackups = () => {
    fetch(`${BASE_URL}/backups-create`);
  };
  const openFile = (e: any) => {
    const { filename } = e.target.dataset;

    window.open(`${BASE_URL}/file/open/${filename}`, '_blank');
  };

  const downloadFile = (e: any) => {
    const { filename } = e.target.dataset;

    window.open(`${BASE_URL}/file/download/${filename}`, '_blank');
  };
  const uploadFile = () => {};

  useEffect(() => {
    if (isLoadBackupFolderFilesSuccess) {
      setFiles(backupFolderFiles);
    }
  }, [backupFolderFiles]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          <BackupIcon color="primary" sx={{ mr: 2 }} />
          './backups' info card
          <IconButton aria-label="delete" onClick={createBackups}>
            <CloudSyncIcon />
          </IconButton>
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          files:
        </Typography>
        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {files.map((f, i) => (
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
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};
