const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ================================
// User Schema
// ================================

const synonimOmimSubSchema = new Schema(
  {
    OMIM: {type: String},
  },
  {_id: false}
);

const PanelSchema = new Schema(
  {
    internalId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    genes: [
      {
        _id: {type: Schema.Types.ObjectId, ref: 'Gene'},
        extra: [synonimOmimSubSchema],
      },
    ],
    variants: [],
    reportText: {
      type: String,
    },
    privateComment: {
      type: String,
    },
    adverseComment: {
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

PanelSchema.index({name: 'text'});

// // name setter
// PanelSchema.path('name').set((v) => {
//   return capitalize(v);
// });

// Pre-save of Panel to database
PanelSchema.pre('save', function(next) {
  next();
});

module.exports = mongoose.model('Panel', PanelSchema);
