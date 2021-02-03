const { Request, validate } = require("../models/request.model");
const { User } = require('../models/user.model');
const { Comment, validateComment } = require("../models/comments.schema");
const Counter = require("../models/counter.model");
const { createNotificationObject, sendEmailNotification, sendSMSNotification } = require("../helpers/notification");
const { NEW,
  INPROGRESS,
  DONE,
  statusTEXT } = require('../constants/status');

const fs = require("fs");

exports.getRequest = (req, res) => {
  Request.find({ user_id: req.user._id }).then((data) => res.send(data));
};

exports.getAllServiceRequests = (req, res) => {
  Request.find().then((data) => res.send(data));
};

exports.createRequest = async (req, res) => {
  const file = req.file;
  const path = file ? file.path : undefined;

  const result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  let counter = await Counter.findOneAndUpdate(
    { name: "request_number" },
    { $inc: { count: 1 } }
  ).exec();

  if (!counter) {
    //create first counter if none
    counter = new Counter({
      name: "request_number",
      count: 0,
    });
  }

  const request = new Request({
    date: req.body.date,
    type: req.body.type,
    subject: req.body.subject,
    description: req.body.description,
    status: req.body.status,
    image: path,
    request_number: counter.count,
    unit_num: req.body.unit_num,
    resident_name: req.body.resident_name,
    user_id: req.user._id,
  });

  request.save().then((data) => res.send(data));
};

exports.deleteRequest = async (req, res) => {
  console.log(req.params.id)
  const serviceRequestId = req.params.id;
  let request = await Request.findById(serviceRequestId);

  if (!request) return res.status(404).send("The request was not found");

  // if (request.user_id !== req.user._id)
  //   return res.status(401).send("Unauthorized");

  //erase image on the server if one
  if (request.image) {
    fs.unlink(`./${request.image}`, (err) => {
      if (err) console.log(err);
    });
  }
  request = await Request.deleteOne({ _id: serviceRequestId });
  if (!request) return res.status(404).send("The request was not found");

  res.send(request);
};

exports.commentOnRequest = async (req, res) => {
  const serviceRequestId = req.params.requestId;
  const request = await Request.findById(serviceRequestId);

  if (!request) return res.status(404).send("The request was not found");

  // if (request.user_id !== req.user._id)
  //   return res.status(401).send("Unauthorized");

  const result = validateComment(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  if (!request.comments) {
    request.comments = [];
  }

  request.comments.push({
    name: req.body.name,
    comment: req.body.comment,
    isManager: false
  });

  await request.save();

  return res.status(200).send(request);
};

exports.commentOnRequestAsManager = async (req, res) => {
  const serviceRequestId = req.params.requestId;
  const request = await Request.findById(serviceRequestId);

  if (!request) return res.status(404).send("The request was not found");

  // if (request.user_id !== req.user._id)
  //   return res.status(401).send("Unauthorized");

  const result = validateComment(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  if (!request.comments) {
    request.comments = [];
  }

  request.comments.push({
    name: req.body.name,
    comment: req.body.comment,
    isManager: true
  });

  await request.save();

  return res.status(200).send(request);
};


exports.updateStatusOnRequestAsManager = async (req, res) => {
  const serviceRequestId = req.params.requestId;
  const request = await Request.findById(serviceRequestId); // request = request document from database to check if it is updated



  if (request.status === req.body.status) {
    return res.send({ message: "DB has been updated." })
  }

  const user = await User.findById(request.user_id);

  const residentEmail = user.email
  const emailSubject = "Your request status has changed to " + statusTEXT[req.body.status]
  const emailTextBody = emailSubject
  const emailHtmlBody = emailSubject

  const residentNotificationEmail = createNotificationObject(residentEmail, emailSubject, emailTextBody, emailHtmlBody)
  // const responseNotification = await sendEmailNotification(residentNotificationEmail)


  // const responseSMS = await sendSMSNotification(resident.phone, emailSubject)
  request.status = req.body.status;
  await request.save();
  return res.status(200).send(request);
};