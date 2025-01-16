import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Fetch user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData;

    // Update cart logic
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    // Fetch user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData;

    if (cartData[itemId]) {
      cartData[itemId][size] = quantity;
    } else {
      return res.status(400).json({ success: false, message: "Item not found in cart" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart data with discount
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData;
    const isStudent = userData.isStudent;

    // Calculate subtotal
    let subtotal = 0;
    for (const itemId in cartData) {
      for (const size in cartData[itemId]) {
        const quantity = cartData[itemId][size];
        const productPrice = 100; // Replace with actual product price logic
        subtotal += productPrice * quantity;
      }
    }

    // Calculate discount
    const discount = isStudent ? subtotal * 0.1 : 0; // 10% discount for students
    const total = subtotal - discount;

    res.json({ success: true, cartData, subtotal, discount, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
