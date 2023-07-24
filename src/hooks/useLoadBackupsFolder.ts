import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../common';

async function loadBackupsFolderFiles() {
  const response = await fetch(`${BASE_URL}/backups`);
  return await response.json();
}

export const useLoadBackupsFolder = () => {
  const { data, isSuccess } = useQuery({ queryKey: ['backups'], queryFn: loadBackupsFolderFiles });

  return {
    backupFolderFiles: data,
    isLoadBackupFolderFilesSuccess: isSuccess,
  };
};
