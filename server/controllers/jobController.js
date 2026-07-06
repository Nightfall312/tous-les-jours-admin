const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Ажлын зарууд авахад алдаа гарлаа",
      error: error.message,
    });
  }
};

const getActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Идэвхтэй ажлын зарууд авахад алдаа гарлаа",
      error: error.message,
    });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      salary,
      description,
      requirements,
      isActive,
    } = req.body;

    if (!title || !location || !type || !description) {
      return res.status(400).json({
        message: "Гарчиг, байршил, төрөл, тайлбар шаардлагатай",
      });
    }

    const job = await Job.create({
      title,
      location,
      type,
      salary,
      description,
      requirements,
      isActive,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: "Ажлын зар үүсгэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Ажлын зар олдсонгүй" });
    }

    job.title = req.body.title ?? job.title;
    job.location = req.body.location ?? job.location;
    job.type = req.body.type ?? job.type;
    job.salary = req.body.salary ?? job.salary;
    job.description = req.body.description ?? job.description;
    job.requirements = req.body.requirements ?? job.requirements;
    job.isActive =
      req.body.isActive !== undefined ? req.body.isActive : job.isActive;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: "Ажлын зар шинэчлэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Ажлын зар олдсонгүй" });
    }

    await job.deleteOne();

    res.json({ message: "Ажлын зар устгагдлаа" });
  } catch (error) {
    res.status(500).json({
      message: "Ажлын зар устгахад алдаа гарлаа",
      error: error.message,
    });
  }
};

module.exports = {
  getJobs,
  getActiveJobs,
  createJob,
  updateJob,
  deleteJob,
};