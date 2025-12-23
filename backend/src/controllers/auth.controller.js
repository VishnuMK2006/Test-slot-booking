import LoginLog from "../models/LoginLog.js";

export const barcodeLogin = async (req, res) => {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber) {
      return res.status(400).json({ message: "Roll number required" });
    }

    await LoginLog.create({ rollNumber });

    res.status(201).json({
      message: "Login recorded",
      rollNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
