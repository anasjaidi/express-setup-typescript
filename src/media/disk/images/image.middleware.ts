// class DiskMediaImages {
//   constructor() {

import path from "path";
import AppError from "../../../app/errors/AppError";
import ErrorsWrapper from "../../../app/errors/ErrorsWrapper";
import MediaLibDAOSingleton from "../../lib/media.repository";
import uploaderFactory from "../../conf/diskMedia.conf";
import { AuthedReq } from "../../conf/diskMediaConf";
import sharp from "sharp";

//   }

// }

const singleMemoryImageUploadMiddleware = uploaderFactory(
	"MEMORY",
	"image/",
	null,
	null,
	100 * 1024 * 1024
).single("image");

const manyMemoryImageUploadMiddleware = uploaderFactory(
	"MEMORY",
	"image/",
	null,
	null,
	100 * 1024 * 1024
).fields([{name: "images", maxCount: 2}]);

const addSingleDiskImageToLib = ErrorsWrapper(async (req, res, next) => {
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

	const newFile = await MediaLibDAOSingleton.createMedia(file);

	next();
});

const addManyDiskImagesToLib = ErrorsWrapper(async (req, res, next) => {
	if (!req.files || !("images" in req.files)) {
		return next(new AppError(400, "File not found"));
	}

	await Promise.all(
		req.files.images.map(async (img, i) => {
			const { path, mimetype, originalname, size } = img;
			const file = {
				name: originalname,
				url: path,
				mimetype,
				size: size / 1e6,
				uploderId: (req as AuthedReq).user.uid,
			};

			const newFile = await MediaLibDAOSingleton.createMedia(file);
		})
	);
	next();
});

const singleImageCroperMiddlewareFactory = (
	W: number,
	H: number,
	quality: number
) => {
	return ErrorsWrapper(async (req, res, next) => {
		if (!req.file) next(new AppError(400, "no image provided"));

		const imagePath =
			path.join(__dirname, "..", "..", "..", "..", "uploads") +
			"/" +
			`image-${(req as AuthedReq).user.uid}-${Date.now()}.jpeg`;

		await sharp(req.file?.buffer)
			.resize(W, H)
			.toFormat("jpeg")
			.jpeg({ quality: quality })
			.toFile(imagePath);

		req.file!.path = imagePath;
		next();
	});
};

const manyImagesCroperMiddlewareFactory = (
	W: number,
	H: number,
	quality: number
) => {
	return ErrorsWrapper(async (req, res, next) => {
		if (!req.files || !("images" in req.files))
			return next(new AppError(400, "no images provided"));

		await Promise.all(
			req.files?.images.map(async (img, i) => {
				const imagePath =	(path.join(__dirname, "..", "..", "..", "..", "uploads") + "/" + `image-${(req as AuthedReq).user.uid}-${Date.now()}-${i + 1}.jpeg`)
          await sharp(img.buffer)
            .resize(W, H)
            .toFormat("jpeg")
            .jpeg({ quality: quality })
            .toFile(imagePath);
            if (req.files && ("images" in req.files)) {
              req.files.images[i].path = imagePath
            }
			})
		);


		next();
	});
};

const single = {
  singleMemoryImageUploadMiddleware,
  singleImageCroperMiddlewareFactory,
  addSingleDiskImageToLib
}

const many = {
  manyMemoryImageUploadMiddleware,
  manyImagesCroperMiddlewareFactory,
  addManyDiskImagesToLib
}

const DiskMediaImages = {
	single,
  many
};

export default DiskMediaImages;
