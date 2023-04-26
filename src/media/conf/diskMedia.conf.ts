import multer, { diskStorage, memoryStorage } from "multer";
import { join } from "path";
import AppError from "../../app/errors/AppError";
import {
	MulterConfFilterCallBackType,
	MulterStorageConfFunctionType,
} from "./diskMediaConf";

// start Storage Config Functions

const multerDestinationFactory = (
	fileLocation: string
): MulterStorageConfFunctionType => {
	return (req, file, cb) => {
		cb(null, join(__dirname, "..", "..", "..", fileLocation));
	};
};

const multerFileNameFactory = (
	fileType: string
): MulterStorageConfFunctionType => {
	return (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${fileType}-${"req.user.uid"}-${Date.now()}.${ext}`);
	};
};

const multerFileTypeFilter = (
	mimeType: string
): MulterConfFilterCallBackType => {
	return (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new AppError(409, "Only images are allowed!") as Error, false);
		}
	};
};

const uploaderFactory = (
	location: "MEMORY" | "DISK",
	mimeType: string,
	fileType: string | null,
	fileLocation: string | null,
	maxFileSize: number
) => {
	let storage: multer.StorageEngine;

	if (location === "MEMORY") {
		storage = memoryStorage();
	} else {
		storage = diskStorage({
			destination: multerDestinationFactory(fileLocation!) as unknown as string,
			filename: multerFileNameFactory(fileType!),
		});
	}
	return multer({
		storage,
		fileFilter: multerFileTypeFilter(mimeType),
		limits: { fileSize: maxFileSize },
	});
};

export default uploaderFactory;
