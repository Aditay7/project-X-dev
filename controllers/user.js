const User = require("../models/user");

const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const user = new User({ name, username, email, password });
    await user.save();

    res.status(201).json({ message: "User Registered", user });
  } catch (error) {
    res.status(500).json({ message: "Error while registering user", error });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res
      .cookie("token", token)
      .json({ message: "Login Sucessfull", token: token });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "Incorrect Email or Password",
    });
  }
};

const Update = async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, password, avatar } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update only the provided user fields

    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (avatar) user.avatar = avatar;

    const updateUser = await user.save();
    res.status(200).json({
      message: "User updated Successfully",
      user: {
        id: updateUser._id,
        name: updateUser.name,
        username: updateUser.username,
        email: updateUser.email,
        password: updateUser.password,
        avatar: updateUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error while Updating User", error });
  }
};

const RegisterFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;
    console.log(
      `[RegisterFcmToken] Start: userId=${userId}, fcmToken=${fcmToken}`
    );
    const user = await User.findById(userId);
    console.log(`[RegisterFcmToken] After findById: user=${user}`);
    if (!user) {
      console.error(`[RegisterFcmToken] User not found for userId: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }
    user.fcmToken = fcmToken;
    const savePromise = user.save();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Save timed out")), 5000)
    );
    await Promise.race([savePromise, timeout]);
    console.log(`[RegisterFcmToken] After save`);
    res.status(200).json({ message: "FCM token saved" });
  } catch (err) {
    console.error(`[RegisterFcmToken] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  Register,
  Login,
  Update,
  RegisterFcmToken,
};
