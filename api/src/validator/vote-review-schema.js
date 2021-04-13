import { record, vote } from '../common/constants.js';
import reactionsEnum from '../common/reactions.enum.js';

export default {
  userId: (value) => typeof value === 'number' && value > record.MIN_USER_ID_VALUE,
  reactionId: (value) => typeof value === 'number' && value > vote.MIN_REACTION_ID_VALUE && Object.values(reactionsEnum).includes(value),
  // reviewId: (value) => typeof value === 'number' && value > vote.MIN_REVIEW_ID_VALUE,
  // reactionName: (value) => Object.keys(reactionsEnum).includes(value),
};
