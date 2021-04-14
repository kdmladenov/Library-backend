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

const createReview = (booksData, reviewsData, recordsData) => async (content, userId, bookId) => {
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

  const review = await reviewsData.create(content, userId, bookId);

  return {
    error: null,
    result: review,
  };
};

const updateReview = reviewsData => async (content, reviewId, userId, role) => {
  // checks if the review exists
  const existingReview = await reviewsData.getBy('review_id', reviewId);
  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  // checks if the user who attempt to update the review is the author of the review
  if (userId !== +existingReview.userId && role !== 'admin') {
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

const deleteReview = reviewsData => async (reviewId, userId, role) => {
  const existingReview = await reviewsData.getBy('review_id', reviewId);
  if (!existingReview) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  // checks if the user who attempt to delete the review is the author of the review
  if (userId !== +existingReview.userId && role !== 'admin') {
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

const voteReview = reviewVoteData => async (reviewId, userId, reactionId, role) => {
  const existingReview = await reviewVoteData.getBy('review_id', reviewId);

  if (existingReview && userId !== existingReview.userId && role !== 'admin') {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  if (existingReview && (userId === existingReview.userId || role === 'admin')) {
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
