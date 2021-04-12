import express from 'express';
import reviewsData from '../data/reviews-data.js';
import injectUser from '../middleware/inject-user.js';
import validateBody from '../middleware/validate-body.js';
import reviewsService from '../services/reviews-service.js';
import errors from '../services/service-errors.js';
import createReviewSchema from '../validator/create-review-schema.js';

const reviewsController = express.Router();

reviewsController.use(injectUser);

reviewsController
// update review
  .patch('/:reviewId', validateBody('review', createReviewSchema), async (req, res) => {
    const { content } = req.body;
    const { reviewId } = req.params;
    const { userId } = req.user;

    const { error, result } = await reviewsService.updateReview(reviewsData)(content, +reviewId, +userId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The review is not found.' });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({ message: 'No rights to update the review.' });
    } else {
      res.status(200).send(result);
    }
  })

// delete review
  .delete('/:reviewId', async (req, res) => {
    const { userId } = req.user;
    const { reviewId } = req.params;

    const { error, result } = await reviewsService.deleteReview(reviewsData)(+reviewId, +userId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The review is not found.' });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({ message: 'No rights to delete the review.' });
    } else {
      res.status(200).send(result);
    }
  });

export default reviewsController;
