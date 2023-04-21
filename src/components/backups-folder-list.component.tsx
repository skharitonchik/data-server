import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import BackupIcon from '@mui/icons-material/Backup';
import Divider from '@mui/material/Divider';

export const BackupsFolderList = () => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          <BackupIcon color="primary" sx={{ mr: 2 }} />
          './backups' info card
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          files:
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};
