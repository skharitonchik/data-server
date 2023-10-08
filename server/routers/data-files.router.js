const Router = require('express');
const router = Router();
const dataFolderFilesController = require('../controllers/data-files.controller');

router.get('/backups', dataFolderFilesController.getBackups);
router.get('/backups-create', dataFolderFilesController.createBackups);
router.get('/file-backups/download/:filename', dataFolderFilesController.downloadBackup);
router.get('/data', dataFolderFilesController.getDataFolderFiles);
router.get('/file/open/:filename', dataFolderFilesController.openDataFolderFile);
router.get('/file/download/:filename', dataFolderFilesController.downloadDataFolderFile);

module.exports = router;
