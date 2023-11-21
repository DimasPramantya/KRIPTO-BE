const getToken = (headers) => {
  const authorizationHeader = headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return (authorizationHeader.substring(7)); // Remove 'Bearer ' from the header
  }
  else {
      const error = new Error("You need to login");
      error.statusCode = 403;
      throw error;
  }
}

const userAuthorization = async(req,res,next)=>{
  try {
    const token = getToken(req.headers);
    req.token = token;
    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message
    })
  }
}

module.exports = userAuthorization;

