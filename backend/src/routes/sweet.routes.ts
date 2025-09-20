import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import * as sweetCtrl from '../controllers/sweet.controller';

const router = Router();
router.use(authenticate); 

router.post('/:id/purchase', sweetCtrl.purchase);        
router.post('/:id/restock', requireAdmin, sweetCtrl.restock); 

export default router;
