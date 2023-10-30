const mongoose = require('mongoose');

// Define the audit schema
const auditSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who made the change
    timestamp: { type: Date, default: Date.now }, // Timestamp of the change
    action: { type: String, required: true }, // Action performed (create, update, delete)
    documentType: { type: String, required: true }, // Type of document (e.g., "User", "Product")
    documentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the document that was changed
    dataBefore: { type: Object }, // Data before the change
    dataAfter: { type: Object }, // Data after the change
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create the audit model
const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
