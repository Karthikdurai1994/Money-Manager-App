const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const appErr = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");

// User Register API Controller
const userRegisterController = async (req, res, next) => {
  try {
    // Getting req.body data
    const { fullname, email, password } = req.body;

    // Check if the email exists
    const emailFound = await User.findOne({ email }); // Checking if the user email exists in database
    if (emailFound) {
      const emailNotFoundError = appErr("User already exits", 400); // Getting error object from "appErr.js" with the message and status code sent
      return next(emailNotFoundError); // Sending the error to "globalErrorHandler.js" middleware
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10); // Generating salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user and save it in Database
    const createdUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Send response to the front-end
    res.json({
      status: "Success",
      message: {
        id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// User Login API Controller
const userLoginController = async (req, res, next) => {
  try {
    // Destrucuture data sent from front-end
    const { email, password } = req.body;

    // Check if email exists or not
    const userFromDB = await User.findOne({ email });
    if (!userFromDB) {
      // If user email is not found in DB, then send error response to front end
      const invalidCredentialsErrorObj = appErr("Invalid Credentials", 400);
      return next(invalidCredentialsErrorObj); // Transferring the control to global error handler (globalErrorHandler.js)
    }

    // Compare password sent from front-end with hashed password saved in database
    const checkPassword = await bcrypt.compare(password, userFromDB.password);
    if (!checkPassword) {
      const invalidCredentialsErrorObj = appErr("Invalid Credentials", 400);
      return next(invalidCredentialsErrorObj); // Transferring the control to global error handler (globalErrorHandler.js)
    }

    // If both email and password exists, then send the message to front end
    res.json({
      status: "Success",
      message: {
        id: userFromDB._id,
        email: userFromDB.email,
        token: generateToken(userFromDB._id),
      },
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// User Profile View API Controller
const userProfileViewController = async (req, res) => {
  try {
    // Getting user ID from req.user which is done by "isLoggedIn.js" middleware file
    const userID = req.user;
    const user = await User.findById(userID).populate({
      // Expanding nested subfields [that is data from other collection [table]]
      path: "accounts",
      populate: {
        path: "transactions",
      },
    });
    const { password, ...filteredUser } = user.toObject(); // Removing password fields before sending it to front-end
    res.json({
      status: "Success",
      message: {
        user: filteredUser,
      },
    });
  } catch (err) {
    res.json({ error: err });
  }
};

//  User Profile Update API Controller
const userProfileUpateController = async (req, res, next) => {
  try {
    // Step-1: Check if user is updating email ID. If there is already email ID is used by someone, then send error
    if (req.body.email) {
      const userWithEmailFound = await User.findOne({ email: req.body.email });
      if (userWithEmailFound) {
        const userWithEmailFoundErrorObj = appErr(
          "Email aready taken, try some other Email ID",
          400
        );
        return next(userWithEmailFoundErrorObj);
      }
    }
    // Step-2: Check if user is updating password. Then hash the password and send the response to the user
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const updatedUserPassword = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "Success",
        message: "User Profile is updated successfully",
      });
    }
    // Step-3: If user is trying to update remaining fields, then update those fields and send the response to the user
    const updatedUserFields = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    }); // Here "new:true" is used to send the updated data to the front-end and "runValidators: true" is used to run validation
    return res.status(200).json({
      status: "Success",
      message: "User Profile is updated successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Uses Profile Delete API Controller
const userProfileDeleteController = async (req, res, next) => {
  try {
    // Find the user by ID and delete from the database
    await User.findByIdAndDelete(req.user);
    res.status(200).json({
      status: "Success",
      message: "User deleted successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

module.exports = {
  userRegisterController,
  userLoginController,
  userProfileViewController,
  userProfileUpateController,
  userProfileDeleteController,
};
