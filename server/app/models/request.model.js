const mongoose = require("mongoose");
const Joi = require("joi");
const { Comment } = require("./comments.schema");

const schema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  type: String,
  subject: String,
  description: String,
  status: {type: Number, default: 0},
  image: String,
  request_number: Number,
  unit_num: String,
  resident_name: String,
  user_id: String,
  comments: [{ type: Comment }],
});

const Request = mongoose.model("request", schema);

function validateRequest(request) {
  const schema = Joi.object({
    date: Joi.string().required(),
    type: Joi.string().required(),
    subject: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.boolean(),
    image: Joi.binary(),
    request_number: Joi.number(),
    unit_num: Joi.string(),
    resident_name: Joi.string(),
    user_id: Joi.string(),
  });

  return schema.validate(request);
}
exports.Request = Request;
exports.validate = validateRequest;
