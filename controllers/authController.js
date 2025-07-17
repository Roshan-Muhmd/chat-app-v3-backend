import { generateToken } from "../helpers/authHelper.js";
import { UserModal } from "../modals/common.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {

  const newUser = new UserModal({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  newUser
    .save()
    .then((doc) => {
      return res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: doc._doc,
      });

      console.log("User added:", doc);
    })
    .catch((err) => {
      return res.status(500).json({
        status: "failed",
        message: "User creation failed",
      });
      console.error("Error saving user:", err);
    });
};

export const userLogin = async (req, res) => {
  const userData = await UserModal.findOne({ email: req.body.email }).lean();

  if (userData) {
    //Compare Password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(userData);

    res.cookie("auth_token", token, {
      httpOnly: true, // Important to prevent client-side access (XSS protection)
      /* secure: process.env.NODE_ENV === 'production',  // Use `secure: true` in production for HTTPS */
      maxAge: 3600000, // 1 hour in milliseconds (you can adjust this)
      secure: true,
    sameSite: 'None'
    });


    return res.status(200).json({
      status: "Success",
      data: {},
      message: "Sign in Success",
    });

 
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Invalid UserName",
    });
  }
};

export const checkToken = (req, res) => {
  const token = req.cookies.auth_token;
 
  if (!token) {
    return res.status(403).send("Access denied: No token provided");
  }

  jwt.verify(token, "jwt_secret_key_roshan" , (err, decoded) => {
    if (err) {
      return res.status(403).send("Access denied: Invalid token");
    }

    // Attach the decoded user data to the request object
    req.user = decoded;
    return res.status(200).json({
      status:"success",
      message : "Token is valid",
      data:decoded
    })
     // Proceed to the next middleware or route handler
  });
};
