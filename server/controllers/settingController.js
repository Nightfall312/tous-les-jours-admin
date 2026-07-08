const Setting = require("../models/Setting");

const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Тохиргоо авахад алдаа гарлаа",
      error: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    const allowedFields = [
      "bakeryName",
      "businessPhone",
      "openingHours",
      "closingHours",
      "deliveryFee",
      "enableDelivery",
      "deliveryStartTime",
      "deliveryEndTime",
      "deliveryDuration",
      "cookTime",
      "facebook",
      "instagram",
    ];

    const body = req.body || {};

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        settings[field] = body[field];
      }
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({
      message: "Тохиргоо хадгалахад алдаа гарлаа",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};