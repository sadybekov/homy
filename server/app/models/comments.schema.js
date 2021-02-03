const mongoose = require("mongoose");
const Joi = require("joi");

const schema = mongoose.Schema(
  {
    comment: { type: String },
    name: { type: String },
    isManager: Boolean
  },
  { timestamps: true }
);

exports.validateComment = function validateComment(comment) {
  const schema = Joi.object({
    comment: Joi.string().required(),
    name: Joi.string().required(),
    isManager: Joi.boolean()
  });

  return schema.validate(comment);
};

exports.Comment = schema;
