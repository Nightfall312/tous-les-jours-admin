const Job = require("../models/Job");

const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
};

const getActiveJobs = async (req, res) => {
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(jobs);
};

const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
};

const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Ажлын байр олдсонгүй" });
  }

  Object.assign(job, req.body);

  const updatedJob = await job.save();
  res.json(updatedJob);
};

const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Ажлын байр олдсонгүй" });
  }

  await job.deleteOne();
  res.json({ message: "Ажлын байр устгагдлаа" });
};

module.exports = {
  getJobs,
  getActiveJobs,
  createJob,
  updateJob,
  deleteJob,
};