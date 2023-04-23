import multer from "multer";
import { Request } from "express";
import path from "path";
import {
	MulterConfFilterCallBackType,
	MulterStorageConfFunctionType,
} from "./media";
import AppError from "../../app/errors/AppError";

const multerConfDest: MulterStorageConfFunctionType = (req, file, cb) => {
	cb(null, path.join(__dirname, "..", "..", "..", "uploads"));
};

const multerConfFileName: MulterStorageConfFunctionType = (req, file, cb) => {
	const ext = file.mimetype.split("/")[1];
	cb(null, `image-${"req.user.uid"}-${Date.now()}.${ext}`);
};

const imageStorage = multer.diskStorage({
	destination: multerConfDest as unknown as string,
	filename: multerConfFileName,
});

const imageFilter: MulterConfFilterCallBackType = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new AppError(400, "Only images are allowed!") as Error, false);
	}
};

const imageBuffer = multer.memoryStorage();

const imagesUploader = multer({
	storage: imageBuffer,
	fileFilter: imageFilter,
});

export default imagesUploader;
