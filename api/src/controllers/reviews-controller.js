/* eslint-disable max-len */
import express from 'express';
import reviewsData from '../data/reviews-data.js';
import injectUser from '../middleware/inject-user.js';
import validateBody from '../middleware/validate-body.js';
import reviewsService from '../services/reviews-service.js';
import errors from '../services/service-errors.js';
import createReviewSchema from '../validator/create-review-schema.js';

const reviewsController = express.Router();

reviewsController

// read review
  .get('/:bookId/reviews', async (req, res) => {
    const { bookId } = req.params;

    const { error, result } = await reviewsService.getAllReviews(reviewsData)(bookId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The book is not found.' });
    } else {
      res.status(200).send(result);
    }
  })

// create review
  .post('/:bookId/reviews', injectUser, validateBody('review', createReviewSchema), async (req, res) => {
    const { bookId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const { error, result } = await reviewsService.createReview(reviewsData)(content, userId, bookId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The book is not found.' });
    } else {
      res.status(200).send(result);
    }
  })

// update review
  .patch('/:bookId/reviews/:reviewId', injectUser, validateBody('review', createReviewSchema), async (req, res) => {
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
  .delete('/:bookId/reviews/:reviewId', injectUser, async (req, res) => {
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
