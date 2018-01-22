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
  },
  {
    timestamps: true,
  }
);

// name setter
GeneSchema.path('name').set((v) => {
  return capitalize(v);
});

// Pre-save of user to database, hash password if password is modified or new
GeneSchema.pre('save', function(next) {});

module.exports = mongoose.model('Gene', GeneSchema);
