import { vote } from '../common/constants.js';
import reactionsEnum from '../common/reactions.enum.js';

export default {
  reactionId: value => typeof value === 'number' && value > vote.MIN_REACTION_ID_VALUE && Object.values(reactionsEnum).includes(value),
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
