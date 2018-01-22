const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ================================
// User Schema
// ================================
const PanelSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    creatorName: {
      type: String,
    },
    genes: [{type: Schema.Types.ObjectId, ref: 'Gene'}],
    variants: [],
    reportText: {
      type: String,
    },
    privateComment: {
      type: String,
    },
    version: {
      type: String,
    },
    depth: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// name setter
PanelSchema.path('name').set((v) => {
  return capitalize(v);
});

// Pre-save of Panel to database
PanelSchema.pre('save', function(next) {});

module.exports = mongoose.model('Panel', PanelSchema);
