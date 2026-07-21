// const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   try {
//     let token = req.headers.authorization;

//     if (!token || !token.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized",
//       });
//     }

//     token = token.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

// module.exports = protect;

const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protect = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }


    const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    const user = await User.findById(decoded.id);


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    req.user = user;


    next();


  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};


module.exports = protect;