const getCallbackValue = (props = {}, key, defaultValue) => {
  const { [key]: item = false } = props;
  if (!item) return defaultValue;
  if (typeof item === 'function') return item(defaultValue);
  return item;
};

module.exports = {
  getCallbackValue,
}
