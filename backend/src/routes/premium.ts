import { Router } from 'express';
import db from 'croxydb';

const router = Router();

router.get('/plans', (req, res) => {
  const plans = db.get('premium.plans') || [];
  res.json(plans);
});

router.get('/faq', (req, res) => {
  const faq = db.get('faq') || [];
  res.json(faq);
});

export default router;
