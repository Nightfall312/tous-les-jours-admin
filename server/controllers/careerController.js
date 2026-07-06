const CareerApplication = require("../models/CareerApplication");

const createApplication = async (req, res) => {
  try {
    const { fullName, phone, email, position, experience, message } = req.body;

    if (!fullName || !phone || !position) {
      return res.status(400).json({
        message: "Нэр, утас, ажлын байр шаардлагатай",
      });
    }

    const application = await CareerApplication.create({
      fullName,
      phone,
      email,
      position,
      experience,
      message,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: "Анкет илгээхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await CareerApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Анкетууд авахад алдаа гарлаа",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const allowedStatuses = ["new", "reviewed", "accepted", "rejected"];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: "Буруу төлөв байна",
      });
    }

    const application = await CareerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Анкет олдсонгүй" });
    }

    application.status = req.body.status;

    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({
      message: "Анкет шинэчлэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Анкет олдсонгүй" });
    }

    await application.deleteOne();

    res.json({ message: "Анкет устгагдлаа" });
  } catch (error) {
    res.status(500).json({
      message: "Анкет устгахад алдаа гарлаа",
      error: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
};