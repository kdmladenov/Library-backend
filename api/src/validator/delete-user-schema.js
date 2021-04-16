export default {
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
