function addMembers(json, field, members) {
  const content = json[field] || {};
  return {
    ...json,
    [field]: {
      ...content,
      ...members,
    }
  };
}

module.exports = {
  addMembers,
};


