import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.json({ success: false, message: "Not Authorized 1" });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWt_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res
        .json({ success: false, message: "Not Authorised 2" })
        .status(404);
    }
    // next();
  } catch (error) {
    res.json({ success: false, message: error.message }).status(401);
  }
};

export default authSeller;
