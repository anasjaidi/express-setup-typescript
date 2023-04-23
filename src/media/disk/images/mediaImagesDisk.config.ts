import multer from "multer";
import { join } from "path";
import AppError from "../../../app/errors/AppError";
import {
	MulterConfFilterCallBackType,
	MulterStorageConfFunctionType,
} from "./mediaImagesDisk";

// TODO: read it from env vars

const LOCATION = "MEMORY";
const MAX_IMAGE_SIZE = 100 * 1024 * 1024;
const IMAGES_LOCATION = "uploads";

// start Storage Config Functions
const multerConfDest: MulterStorageConfFunctionType = (req, file, cb) => {
	cb(null, join(__dirname, "..", "..", "..", IMAGES_LOCATION));
};

const multerConfFileName: MulterStorageConfFunctionType = (req, file, cb) => {
	const ext = file.mimetype.split("/")[1];
	cb(null, `image-${"req.user.uid"}-${Date.now()}.${ext}`);
};

const imageFilter: MulterConfFilterCallBackType = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new AppError(400, "Only images are allowed!") as Error, false);
	}
};

// Disk Storage
const imagesDiskUploaderStorage = multer.diskStorage({
	destination: multerConfDest as unknown as string,
	filename: multerConfFileName,
});

// Buffer Storage
const imagesBufferUploaderStorage = multer.memoryStorage();

// Disk Uploader
const imagesDiskUploader = multer({
	storage: imagesDiskUploaderStorage,
	fileFilter: imageFilter,
	limits: { fileSize: MAX_IMAGE_SIZE },
});

// Memory Uploader
const imagesBufferUploader = multer({
	storage: imagesBufferUploaderStorage,
	fileFilter: imageFilter,
	limits: { fileSize: MAX_IMAGE_SIZE },
});

// export depends on Location MODE
const mediaConfigSelector = (location: "MEMORY" | "DISK") => {
	if (location === "DISK") {
		return imagesDiskUploader;
	} else {
		return imagesBufferUploader;
	}
};
