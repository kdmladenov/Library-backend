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
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import rolesEnum from '../common/roles.enum.js';
import usersData from '../data/users-data.js';
import errorHandler from '../middleware/errorHandler.js';

const reviewsController = express.Router();

reviewsController
// update review
  .patch('/:reviewId', authMiddleware, loggedUserGuard, banGuard, validateBody('review', createReviewSchema), errorHandler(async (req, res) => {
    const { content } = req.body;
    const { reviewId } = req.params;
    const { userId, role } = req.user;

    const { error, result } = await reviewsService.updateReview(reviewsData)(content, +reviewId, +userId, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The review is not found.',
      });
    } else {
      res.status(200).send(result);
    }
  }))

// delete review
  .delete('/:reviewId', authMiddleware, loggedUserGuard, banGuard, errorHandler(async (req, res) => {
    const { userId, role } = req.user;
    const { reviewId } = req.params;

    const { error, result } = await reviewsService.deleteReview(reviewsData, usersData)(+reviewId, +userId, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The review is not found.',
      });
    } else {
      res.status(200).send(result);
    }
  }))

  // Vote Review - status codes mixed
  .put('/:reviewId/votes', authMiddleware, loggedUserGuard, banGuard, validateBody('vote', voteReviewSchema), errorHandler(async (req, res) => {
    const { reactionName } = req.body;
    const { reviewId } = req.params;
    const { userId, role } = req.user;

    const { result } = await reviewsService.voteReview(reviewVoteData)(reactionName, +reviewId, +userId, role);

    res.status(200).send(result);
  }))

  .delete('/:reviewId/votes', authMiddleware, loggedUserGuard, banGuard, validateBody('vote', voteReviewSchema), errorHandler(async (req, res) => {
    const { reactionId } = req.body;
    const { reviewId } = req.params;
    const { role } = req.user;
    const id = role === rolesEnum.admin ? req.body.userId : req.user.userId;

    const { error, result } = await reviewsService.unVoteReview(reviewVoteData, usersData)(+reactionId, +reviewId, +id, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(403).send({
        message: 'Review is not found.',
      });
    } else {
      res.status(200).send(result);
    }
  }))
  // get review by ID 
  .get('/:reviewId', authMiddleware, loggedUserGuard, banGuard, errorHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { userId, role } = req.user;


    const { error, result } = await reviewsService.readReview(reviewsData)(+reviewId, +userId, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The review is not found.',
      });
    } else {
      res.status(200).send(result);
    }
  }));

export default reviewsController;
