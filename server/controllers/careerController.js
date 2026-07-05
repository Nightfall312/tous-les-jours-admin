const CareerApplication = require("../models/CareerApplication");

const createApplication = async (req, res) => {
  const { fullName, phone, email, position, experience, message } = req.body;

  const application = await CareerApplication.create({
    fullName,
    phone,
    email,
    position,
    experience,
    message,
  });

  res.status(201).json(application);
};

const getApplications = async (req, res) => {
  const applications = await CareerApplication.find().sort({ createdAt: -1 });
  res.json(applications);
};

const updateApplicationStatus = async (req, res) => {
  const application = await CareerApplication.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Анкет олдсонгүй" });
  }

  application.status = req.body.status ?? application.status;

  const updatedApplication = await application.save();
  res.json(updatedApplication);
};

const deleteApplication = async (req, res) => {
  const application = await CareerApplication.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Анкет олдсонгүй" });
  }

  await application.deleteOne();

  res.json({ message: "Анкет устгагдлаа" });
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
};