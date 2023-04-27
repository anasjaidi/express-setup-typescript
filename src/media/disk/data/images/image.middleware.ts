// class DiskMediaImages {
//   constructor() {

import path from "path";
import AppError from "../../../../app/errors/AppError";
import ErrorsWrapper from "../../../../app/errors/ErrorsWrapper";
import MediaLibDAOSingleton from "../../../lib/media.repository";
import uploaderFactory from "../../../conf/diskMedia.conf";
import { AuthedReq } from "../../../conf/diskMediaConf";
import sharp from "sharp";
import diskRepository from "../../repositories/disk.repository";

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
).fields([{ name: "images", maxCount: 2 }]);

const addSingleDiskImageToLib = ErrorsWrapper(async (req, res, next) => {
	if (!req.file) {
		return next();
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

const deleteSingleImageFromLib = ErrorsWrapper(async (req, res, next) => {
	if (!req.body.old) {
		return next();
	}

	await MediaLibDAOSingleton.deleteMedia(req.body.old.id);
});

const deleteManyImagesFromLib = ErrorsWrapper(async (req, res, next) => {
	if (!req.body.olds) {
		return next();
	}
	await Promise.all(
		req.body.olds.map((old) => {
			MediaLibDAOSingleton.deleteMedia(old.id);
		})
	);
	MediaLibDAOSingleton.deleteMedia(req.body.old);
});

const addManyDiskImagesToLib = ErrorsWrapper(async (req, res, next) => {
	if (!req.files || !("images" in req.files)) {
		return next();
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

const singleImageDiskSaverAndCroperMiddlewareFactory = (
	W: number,
	H: number,
	quality: number
) => {
	return ErrorsWrapper(async (req, res, next) => {

		// check if file exists
		if (!req.file) return next();

		// init media save path
		const imagePath =
			path.join(__dirname, "..", "..", "..", "..", "uploads") +
			"/" +
			`image-${(req as AuthedReq).user.uid}-${Date.now()}.jpeg`;

		// crop the image and save it as a buffer
		const buffer = await sharp(req.file?.buffer)
			.resize(W, H)
			.toFormat("jpeg")
			.jpeg({ quality: quality })
			.toBuffer();

		// save image to local storage
		await diskRepository.saveFileToDiskStorage(buffer, imagePath);

		// add savepath to file payload
		req.file!.path = imagePath;

		// calling next middleware
		next();
	});
};

const manyImagesDiskSaverAndCropperMiddlewareFactory = (
	W: number,
	H: number,
	quality: number
) => {
	return ErrorsWrapper(async (req, res, next) => {

		// check if there is a files and target named images in the files object
		if (!req.files || !("images" in req.files)) return next();

		// fire a bunch of promises at same time and wait them
		await Promise.all(

			req.files?.images.map(async (img, i) => {

				// init media save path 
				const imagePath =
					path.join(__dirname, "..", "..", "..", "..", "uploads") +
					"/" +
					`image-${(req as AuthedReq).user.uid}-${Date.now()}-${i + 1}.jpeg`;

				// crop the image and save it as a buffer
				const buffer = await sharp(img.buffer)
					.resize(W, H)
					.toFormat("jpeg")
					.jpeg({ quality: quality })
					.toBuffer();
				
				
				// save media to local storage
				await diskRepository.saveFileToDiskStorage(buffer, imagePath)

				if (req.files && "images" in req.files) {
					req.files.images[i].path = imagePath;
				}
			})
		);

		next();
	});
};

const single = {
	singleMemoryImageUploadMiddleware,
	singleImageDiskSaverAndCroperMiddlewareFactory,
	addSingleDiskImageToLib,
	deleteSingleImageFromLib,
};

const many = {
	manyMemoryImageUploadMiddleware,
	manyImagesDiskSaverAndCropperMiddlewareFactory,
	addManyDiskImagesToLib,
	deleteManyImagesFromLib,
};

const DiskMediaImages = {
	single,
	many,
};

export default DiskMediaImages;
