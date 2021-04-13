import errors from './service-errors.js';

const getAllReviews = reviewsData => async (bookId, order, page, pageSize) => {
  const reviews = await reviewsData.getAll(bookId, order, page, pageSize);

  if (!reviews) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  return {
    error: null,
    result: reviews,
  };
};

const createReview = reviewsData => async (content, userId, bookId) => {
// check if the user attempting to create review already has made one for the same book
// check if the user has borrowed and returned the book
// check if user is banned
};

const updateReview = reviewsData => async (content, reviewId, userId) => {
  const existingReview = await reviewsData.getBy('r.review_id', reviewId);

  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  // checks if the user who attempt to update the review is the author of the review
  if (userId !== existingReview.user_id) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  const updated = { ...existingReview, content, date_edited: new Date().toLocaleDateString('en-US') };
  const _ = await reviewsData.update(content, reviewId);

  return {
    error: null,
    result: updated,
  };
};

const deleteReview = reviewsData => async (reviewId, userId) => {
  const existingReview = await reviewsData.getBy('review_id', reviewId);

  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  // checks if the user who attempt to delete the review is the author of the review
  if (userId !== existingReview.user_id) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  const _ = await reviewsData.remove(reviewId);

  return {
    error: null,
    result: existingReview,
  };
};

const voteReview = reviewVoteData => async (reviewId, userId, reactionId) => {
  const existingReview = await reviewVoteData.getBy('review_id', reviewId);

  if (existingReview && userId !== existingReview.userId) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  if (existingReview && userId === existingReview.userId) {
    const result = await reviewVoteData.update(reviewId, userId, reactionId);

    return {
      error: null,
      result,
    };
  }

  const result = await reviewVoteData.create(reviewId, userId, reactionId);

  return {
    error: null,
    result,
  };
};
export default {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
};
