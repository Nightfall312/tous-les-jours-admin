const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(2)} ${units[index]}`;
};

const sizeInfo = (bytes = 0) => ({
  bytes,
  kb: Number((bytes / 1024).toFixed(2)),
  mb: Number((bytes / 1024 / 1024).toFixed(2)),
  formatted: formatBytes(bytes),
});

const getFolderSize = (folderPath) => {
  if (!fs.existsSync(folderPath)) return 0;

  let total = 0;

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      total += getFolderSize(filePath);
    } else {
      total += stat.size;
    }
  });

  return total;
};

const getStorageStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const dbStats = await db.stats();
    const collections = await db.listCollections().toArray();

    const collectionStats = [];

    for (const collection of collections) {
      const stats = await db.command({
        collStats: collection.name,
      });

      collectionStats.push({
        name: collection.name,
        count: stats.count || 0,
        dataSize: sizeInfo(stats.size || 0),
        storageSize: sizeInfo(stats.storageSize || 0),
      });
    }

    const uploadsPath = path.join(__dirname, "..", "uploads");
    const uploadsBytes = getFolderSize(uploadsPath);

    const totalUsedBytes =
      (dbStats.storageSize || 0) + (dbStats.indexSize || 0) + uploadsBytes;

    const maxStorageBytes =
      Number(process.env.DB_STORAGE_LIMIT_MB || 512) * 1024 * 1024;

    res.json({
      database: {
        name: db.databaseName,
        dataSize: sizeInfo(dbStats.dataSize || 0),
        storageSize: sizeInfo(dbStats.storageSize || 0),
        indexSize: sizeInfo(dbStats.indexSize || 0),
        totalSize: sizeInfo((dbStats.storageSize || 0) + (dbStats.indexSize || 0)),
      },

      uploads: {
        size: sizeInfo(uploadsBytes),
      },

      totalUsed: sizeInfo(totalUsedBytes),

      limit: {
        maxStorage: sizeInfo(maxStorageBytes),
        usedPercent: Number(((totalUsedBytes / maxStorageBytes) * 100).toFixed(2)),
      },

      collections: collectionStats.sort(
        (a, b) => b.storageSize.bytes - a.storageSize.bytes
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Storage мэдээлэл авахад алдаа гарлаа",
      error: error.message,
    });
  }
};

module.exports = {
  getStorageStats,
};