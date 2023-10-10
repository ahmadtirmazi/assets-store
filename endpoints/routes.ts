import createAssetHandler from './create/create.controller';
import express from 'express'
import getAssetHandler from './get/get.controller';
import healthHandler from './health/health.controller';
const router = express.Router();

router.post('/assets', createAssetHandler);
router.get('/assets/:uuid', getAssetHandler);

router.get('/health', healthHandler)

export default router;