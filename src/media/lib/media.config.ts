import multer from "multer";
import { Request } from "express";
import path from "path";
import { MulterConfFilterCallBackType, MulterStorageConfFunctionType } from "./media";
import AppError from "../../app/errors/AppError";

const multerConfDest: MulterStorageConfFunctionType = (req, file, cb) => {
	cb(null, path.join(__dirname, "..", "..", "..", "uploads"));
};

const multerConfFileName: MulterStorageConfFunctionType = (req, file, cb) => {
	const ext = file.mimetype.split("/")[1];
  console.log(file);
	cb(null, `image-${"req.user.uid"}-${Date.now()}.${ext}`);
};

const imageStorage = multer.diskStorage({
	destination: multerConfDest as unknown as string,
	filename: multerConfFileName,
});

const imageFilter: MulterConfFilterCallBackType  = (req, file, cb) => {
  console.log(file);
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(
			new AppError(400, "Only images are allowed!") as Error,
			false
		);
	}
};

const imagesUploader = multer({storage: imageStorage, fileFilter: imageFilter, limits: {fileSize: 10000000}})


export default imagesUploader