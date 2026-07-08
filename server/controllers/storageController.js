const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const bytesToMB = (bytes = 0) => Number((bytes / 1024 / 1024).toFixed(2));

const formatBytes = (bytes = 0) => {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);

    return `${value.toFixed(2)} ${units[index]}`;
};

const sizeInfo = (bytes = 0) => ({
    bytes,
    kb: Number((bytes / 1024).toFixed(2)),
    mb: Number((bytes / 1024 / 1024).toFixed(2)),
    formatted: formatBytes(bytes),
});

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
        const uploadsBytes = formatBytes(uploadsPath);

        res.json({
            database: {
                name: db.databaseName,
                dataSize: sizeInfo(dbStats.dataSize || 0),
                storageSize: sizeInfo(dbStats.storageSize || 0),
                indexSize: sizeInfo(dbStats.indexSize || 0),
                totalSize: sizeInfo(
                    (dbStats.storageSize || 0) + (dbStats.indexSize || 0)
                ),
            },
            uploads: {
                size: sizeInfo(uploadsBytes),
            },
            totalUsed: sizeInfo(
                (dbStats.storageSize || 0) + (dbStats.indexSize || 0) + uploadsBytes
            ),
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