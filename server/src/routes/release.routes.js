const express = require("express");
const router = express.Router();
const multer = require("multer");

const ReleaseController = require("../controllers/release.controller");

//===============================================================================================================//
// Upload Label Picture File (Multer Middleware)
//===============================================================================================================//

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "../client/assets/images/releases")
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

//===============================================================================================================//
// Routes - All Release [GET] Routes
//===============================================================================================================//

// [GET] All Releases Endpoint
router.get("/", ReleaseController.getAllReleases);

// [GET] Single Release By Id Endpoint
router.get("/:id", ReleaseController.validate("checkReleaseId"), ReleaseController.getReleaseById);

// [GET] All Releases By Label Id Endpoint
router.get("/label/:id", ReleaseController.validate("checkReleaseId"), ReleaseController.getReleasesByLabel);

// [GET] All Releases By Artist Id Endpoint
router.get("/artist/:id", ReleaseController.validate("checkReleaseId"), ReleaseController.getReleasesByArtist);

//===============================================================================================================//
// Routes - All Release [POST] Routes
//===============================================================================================================//

// [POST] Add New Release With Text Properties & Image File Endpoint
router.post(
	"/new/file",
	upload.single("image"),
	function (req, res, next) {
		req.body = JSON.parse(req.body.release);
		next();
	},
	ReleaseController.validate("checkReleaseInput"),
	ReleaseController.validate("checkTrackInput"),
	ReleaseController.createNewRelease
);

// [POST] Add New Release With Text Properties Only Endpoint
router.post(
	"/new/text",
	ReleaseController.validate("checkReleaseInput"),
	ReleaseController.validate("checkTrackInput"),
	ReleaseController.createNewRelease
);

// [POST] Import Tracks (To Create Releases) From User File System Endpoint
router.post(
	"/new/import",
	ReleaseController.validate("checkTrackInput"),
	ReleaseController.importNewReleases
);

//===============================================================================================================//
// Routes - All Release [PUT] Routes
//===============================================================================================================//

// [PUT] Update Release Text Properties & Image File Enpoint
router.put(
	"/:id/update/file",
	upload.single("image"),
	function (req, res, next) {
		req.body = JSON.parse(req.body.release);
		next();
	},
	ReleaseController.validate("checkReleaseInput"),
	ReleaseController.validate("checkTrackInput"),
	ReleaseController.updateExistingReleaseById
);

// [PUT] Update Release Text Properties Only Endpoint
router.put(
	"/:id/update/text",
	ReleaseController.validate("checkReleaseInput"),
	ReleaseController.validate("checkTrackInput"),
	ReleaseController.updateExistingReleaseById
);

//===============================================================================================================//
// Routes - All Release [DELETE] Routes
//===============================================================================================================//

// [DELETE] Release By Id
router.delete("/:id", ReleaseController.validate("checkReleaseId"), ReleaseController.removeReleaseById);

//===============================================================================================================//

module.exports = router;
