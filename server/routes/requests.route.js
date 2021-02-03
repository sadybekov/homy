const multer = require("multer");
const auth = require("../app/middleware/auth");
const manager = require("../app/middleware/manager");
const request = require("../app/controllers/requests.controller");
const router = require("express").Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = (app) => {
  router.delete("/:id", auth, request.deleteRequest);
  router.post("/", [auth, upload.single("image")], request.createRequest);
  router.put("/:requestId/comment", auth, request.commentOnRequest);
  router.put('/:requestId/comment/manager', [auth, manager], request.commentOnRequestAsManager);

  router.put('/:requestId/status/manager', [auth, manager], request.updateStatusOnRequestAsManager);

  router.get("/", auth, request.getRequest);

  router.get("/manager/all-service-requests", auth, request.getAllServiceRequests);



  app.use("/api/service-requests", router);
};
