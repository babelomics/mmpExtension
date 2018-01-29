const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ================================
// User Schema
// ================================
const GeneSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save of user to database, hash password if password is modified or new
GeneSchema.pre('save', function(next) {
  next();
});

GeneSchema.pre('insertMany', function(next) {
  console.log('inserting: ' + this.name);
  next();
});

module.exports = mongoose.model('Gene', GeneSchema);
