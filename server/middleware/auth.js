const jwt = require('jsonwebtoken'); 
exports.auth = async (req, res , next) => {
  try {
    const token = req.headers['authtoken'] ;
    console.log(token);
    if(!token){
        res.status(401).send('no token')
    }
    const decoded = jwt.verify(token,'jwtsecret');
    console.log("decoded",decoded);
    req.user = decoded.user ;
    next();

  } catch (err) {
    console.log(err);
    res.send("Invalid Token" ).status(500);
  }
};
