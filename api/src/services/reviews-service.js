import { readingPoints } from '../common/constants.js';
import errors from './service-errors.js';

const getAllReviews = (reviewsData, booksData) => async (bookId, order, page, pageSize) => {
  const existingBook = await booksData.getBy('book_id', bookId);

  if (!existingBook) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const reviews = await reviewsData.getAll(bookId, order, page, pageSize);

  return {
    error: null,
    result: reviews,
  };
};

const createReview = (booksData, reviewsData, recordsData, usersData) => async (content, userId, bookId, rating, title) => {
  // checks if the book exists
  const existingBook = await booksData.getBy('book_id', bookId);
  if (!existingBook) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  // checks if the user has already made a review for the same book
  const existingReview = await reviewsData.getByUserIdAndBookId(userId, bookId);
  if (existingReview) {
    return {
      error: errors.DUPLICATE_RECORD,
      result: null,
    };
  }

  // checks if the user has borrowed and returned the book
  const existingRecord = await recordsData.getRecordByUserIdAndBookId(userId, bookId);
  if (!existingRecord || existingRecord.dateReturned === null) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  const _ = await usersData.updatePoints(userId, readingPoints.POST_REVIEW);
  const review = await reviewsData.create(content, userId, bookId, rating, title);

  return {
    error: null,
    result: review,
  };
};

const updateReview = reviewsData => async (content, reviewId, userId, role, rating, title) => {
  // checks if the review exists
  const existingReview = await reviewsData.getBy('review_id', reviewId, userId, role);

  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const updated = {
    ...existingReview, content, date_edited: new Date().toLocaleDateString('en-US'), rating, title,
  };
  const _ = await reviewsData.update(content, reviewId, userId, role, rating, title);

  return {
    error: null,
    result: updated,
  };
};

const deleteReview = (reviewsData, usersData) => async (reviewId, userId, role) => {
  const existingReview = await reviewsData.getBy('review_id', reviewId, userId, role);

  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const p = await usersData.updatePoints(+existingReview.userId, readingPoints.DELETE_REVIEW);
  const r = await reviewsData.remove(reviewId, userId, role);

  return {
    error: null,
    result: existingReview,
  };
};

const voteReview = reviewVoteData => async (reactionName, reviewId, userId, role) => {
  const existingReview = await reviewVoteData.getBy('review_id', reviewId, userId, role);

  if (existingReview) {
    const result = await reviewVoteData.update(reactionName, reviewId, userId, role);
    return {
      error: null,
      result,
    };
  }

  const result = await reviewVoteData.create(reactionName, reviewId, userId, role);
  return {
    error: null,
    result,
  };
};

const unVoteReview = reviewVoteData => async (reviewId, userId, role) => {
  const existingReview = await reviewVoteData.getBy('review_id', reviewId, userId, role);

  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const _ = await reviewVoteData.remove(reviewId, userId);
  return {
    error: null,
    result: { message: `Vote was successfully removed.` },
  };
};

const readReview = reviewsData => async (reviewId, userId, role) => {
  // checks if the review exists
  const existingReview = await reviewsData.getBy('review_id', reviewId, userId, role);

  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  return {
    error: null,
    result: existingReview,
  };
};
export default {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
  unVoteReview,
  readReview,
};
