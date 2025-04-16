import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      })
    );

    const productCreated = await Product.create({
      ...productData,
      image: imagesUrl,
    });

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const addProduct1 = async (req, res) => {
  let hasResponded = false;

  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    if (!images || images.length === 0) {
      hasResponded = true;
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        } catch (uploadErr) {
          if (!hasResponded) {
            hasResponded = true;
            res
              .status(500)
              .json({ success: false, message: "Image upload failed" });
          }
          throw uploadErr; // rethrow to stop execution
        }
      })
    );

    await Product.create({ ...productData, image: imagesUrl });

    if (!hasResponded) {
      hasResponded = true;
      return res.json({ success: true, message: "Product Added" });
    }
  } catch (error) {
    console.error("addProduct error:", error.message);
    if (!hasResponded && !res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { inStock });
    return res.json({ success: true, message: "Stock Updated", product });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
