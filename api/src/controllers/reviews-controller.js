import express from 'express';
import reviewVoteData from '../data/review-vote-data.js';
import reviewsData from '../data/reviews-data.js';
import validateBody from '../middleware/validate-body.js';
import reviewsService from '../services/reviews-service.js';
import errors from '../services/service-errors.js';
import createReviewSchema from '../validator/create-review-schema.js';
import { authMiddleware } from '../authentication/auth.middleware.js';
import voteReviewSchema from '../validator/vote-review-schema.js';
import banGuard from '../middleware/banGuard.js';

const reviewsController = express.Router();

reviewsController
// update review
  .patch('/:reviewId', authMiddleware, banGuard, validateBody('review', createReviewSchema), async (req, res) => {
    const { content } = req.body;
    const { reviewId } = req.params;
    const { userId, role } = req.user;

    const { error, result } = await reviewsService.updateReview(reviewsData)(content, +reviewId, +userId, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The review is not found.',
      });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: 'No rights to update the review.',
      });
    } else {
      res.status(200).send(result);
    }
  })

// delete review
  .delete('/:reviewId', authMiddleware, banGuard, async (req, res) => {
    const { userId, role } = req.user;
    const { reviewId } = req.params;

    const { error, result } = await reviewsService.deleteReview(reviewsData)(+reviewId, +userId, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The review is not found.',
      });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: 'No rights to delete the review.',
      });
    } else {
      res.status(200).send(result);
    }
  })
  // Vote Review - status codes mixed
  .put('/:reviewId/votes', authMiddleware, banGuard, validateBody('vote', voteReviewSchema), async (req, res) => {
    const { reviewId, role } = req.params;
    const { userId, reactionId } = req.body;

    const { error, result } = await reviewsService.voteReview(reviewVoteData)(+reviewId, +userId, +reactionId, role);

    if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: 'You have no rights to update the vote.',
      });
    } else {
      res.status(200).send(result);
    }
  });

export default reviewsController;
