import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWt_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res
        .json({ success: false, message: "Not Authorised" })
        .status(404);
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message }).status(401);
  }
};

export default authUser;
