const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSession = require("../models/userSession");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const session = await UserSession.create({
      user: user._id,
      role: user.role,
      loginTime: new Date(),
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      sessionId: session._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID required" });
    }

    const session = await UserSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    if (session.logoutTime) {
      return res.status(200).json({ message: "Already logged out" });
    }

    session.logoutTime = new Date();
    await session.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleCheckInOut = async (req, res) => {
  const { sessionId } = req.body;

  const session = await UserSession.findById(sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  if (!session.checkInTime) {
    session.checkInTime = new Date();
    await session.save();
    return res.json({ status: "checked-in", checkInTime: session.checkInTime });
  }

  if (!session.checkOutTime) {
    session.checkOutTime = new Date();
    session.logoutTime = session.checkOutTime;
    await session.save();
    return res.json({ status: "checked-out", checkOutTime: session.checkOutTime });
  }

  res.json({ message: "Already checked out" });
};