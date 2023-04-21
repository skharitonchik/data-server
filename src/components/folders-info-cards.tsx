import Grid from '@mui/material/Grid';
import { DataFolderList } from './data-folder-list.component';
import { BackupsFolderList } from './backups-folder-list.component';

export const FoldersInfoCards = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DataFolderList />
      </Grid>
      <Grid item xs={6}>
        <BackupsFolderList />
      </Grid>
    </Grid>
  );
};
