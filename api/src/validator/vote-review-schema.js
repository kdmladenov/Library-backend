import { vote } from '../common/constants.js';
import reactionsEnum from '../common/reactions.enum.js';

export default {
  reactionName: value => Object.keys(reactionsEnum).includes(value),
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
