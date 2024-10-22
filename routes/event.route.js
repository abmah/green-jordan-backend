import express from 'express';
import {
  createEventController,
  getEventController,
  joinEventController,
  leaveEventController,
  getAllEventsController,
} from '../controllers/event.controller.js';
import { parser } from '../config/cloudinary.js'; // Assuming you're using cloudinary for image uploads

const router = express.Router();

router.post('/', parser.single('img'), createEventController); // Image upload middleware
router.get('/:id', getEventController);
router.put('/join/:id', joinEventController);
router.put('/leave/:id', leaveEventController);
router.get('/', getAllEventsController);

export default router;
