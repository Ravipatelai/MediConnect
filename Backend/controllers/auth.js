const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Doctor = require("../models/doctor");

// ==============================
// Generate JWT Token
// ==============================

const getCookieOptions = (req) => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.RAILWAY_ENVIRONMENT) ||
    (req && (req.headers["x-forwarded-proto"] === "https" || req.secure));

  return {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
  };
};

const generateToken = (req, res, user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const cookieOptions = getCookieOptions(req);

  // Save token in cookie
  res.cookie("jwt", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// ==============================
// Register User
// POST /api/auth/register
// ==============================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Prevent public registration from assigning the admin role
    const assignedRole = role.toLowerCase();
    if (assignedRole === "admin" || !["patient", "doctor"].includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only patient and doctor accounts can be created.",
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    // Create Doctor Profile
    if (assignedRole === "doctor") {
      await Doctor.create({
        doctorId: user._id,
      });
    }

    // Generate Token
    const token = generateToken(req, res, user);

    // Response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// Login User
// POST /api/auth/login
// ==============================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check fixed admin credentials if configured
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    let user;
    if (adminEmail && email === adminEmail && adminPassword && password === adminPassword) {
      user = await User.findOne({ email: adminEmail });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        user = await User.create({
          name: "Administrator",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        });
      } else if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    } else {
      // Find User
      user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Compare Password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    }

    // Generate Token
    const token = generateToken(req, res, user);

    // Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// Logout User
// POST /api/auth/logout
// ==============================

const logOut = async (req, res) => {
  try {
    const cookieOptions = getCookieOptions(req);
    res.cookie("jwt", "", {
      ...cookieOptions,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.log("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Export Controllers
// ==============================

module.exports = {
  registerUser,
  loginUser,
  logOut,
};