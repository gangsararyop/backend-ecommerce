const crypto = require("crypto");

module.exports = (word) => {
  let hashing = crypto
    .createHmac("sha256", "testing")
    .update(word)
    .digest("hex");

  return hashing;
};
