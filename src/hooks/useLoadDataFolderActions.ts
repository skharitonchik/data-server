import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../common';

async function loadDataFolderFiles() {
  const response = await fetch(`${BASE_URL}/data`);
  return await response.json();
}

export const useLoadDataFolderActions = () => {
  const { data, isSuccess } = useQuery({ queryKey: ['data_files'], queryFn: loadDataFolderFiles });

  return {
    dataFolderFiles: data,
    isLoadDataFolderFilesSuccess: isSuccess,
  };
};
