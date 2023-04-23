import { Media } from "@prisma/client";
import AppError from "../../app/errors/AppError";
import ErrorsWrapper from "../../app/errors/ErrorsWrapper";
import imagesUploader from "./media.config";
import MediaLibDAOSingleton from "./media.repository";
import { AuthedReq } from "./media";

const uploadImageMiddleWare = ErrorsWrapper(async (req, res, next) => {
	imagesUploader.single("image")(req, res, async (err) => {
		if (err) return next(err);

		if (!req.file) {
			return next(new AppError(400, "File not found"));
		}

		const { path, mimetype, originalname, size } = req.file!;

		const file = {
			name: originalname,
			url: path,
			mimetype,
			size: size / 1e6,
			uploderId: (req as AuthedReq).user.uid,
		};

		try {
			const newFile = await MediaLibDAOSingleton.createMedia(file);
		} catch (err) {
			next(err);
		}

		next();
	});
});

export default uploadImageMiddleWare;
