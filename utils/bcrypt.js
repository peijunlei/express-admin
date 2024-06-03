

const bcrypt = require('bcryptjs');


exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
exports.comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
}
