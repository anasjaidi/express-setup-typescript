import { Media } from "@prisma/client";
import AppError from "../../app/errors/AppError";
import ErrorsWrapper from "../../app/errors/ErrorsWrapper";
import imagesUploader from "./media.config";
import MediaLibDAOSingleton from "./media.repository";
import { AuthedReq } from "./media";
import sharp from "sharp";
import { join } from "path";

const uploadImageMiddleWare = ErrorsWrapper(async (req, res, next) => {
	imagesUploader.single("image")(req, res, async (err) => {
		if (err) return next(err);

		if (!req.file) {
			return next(new AppError(400, "File not found"));
		}

		let { path, mimetype, originalname, size } = req.file!;

		if (!path) {
			path = join(__dirname, "..", "..", "..", "uploads") + "/" + originalname;

			await sharp(req.file.buffer)
				.resize(600, 600)
				.toFormat("jpeg")
				.jpeg({ quality: 60 })
				.toFile(path);

			console.log(path);

			return next();
		}

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

const uploadImages = ErrorsWrapper(async (req, res, next) => {
	imagesUploader.fields([{ name: "images", maxCount: 3 }])(
		req,
		res,
		async (err) => {
			if (!req.files || !req.files.images) {
				return next(new AppError(400, "no images"));
			}

			await Promise.all(
				req.files.images.map(async (file, i) => {
					console.log(file);
					const imagepath =
						join(__dirname, "..", "..", "..", "uploads") +
						"/" +
						file.originalname;
					await sharp(file.buffer)
						.resize(100, 100)
						.toFormat("jpeg")
						.jpeg({ quality: 60 })
						.toFile(imagepath);
				})
			);

			next();
		}
	);
});

export default { uploadImageMiddleWare, uploadImages };
