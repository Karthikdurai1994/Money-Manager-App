// This is used to get tokens from header

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization; // Getting authorization from header
  const token = authHeader.split(" ")[1]; // Splliting authHeader using "split" and getting the second index which is the actual token that is sent by front-end
  return token;
};

module.exports = getTokenFromHeader;
