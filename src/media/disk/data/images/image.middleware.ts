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

	// check if there is a file with req payload
	if (!req.file) {
		return next();
	}

	// extract infos about media
	const { path, mimetype, originalname, size } = req.file!;

	// init save file object
	const file = {
		name: originalname,
		url: path,
		mimetype,
		size: size / 1e6,
		uploderId: (req as AuthedReq).user.uid,
	};

	// ave object to media library
	const newFile = await MediaLibDAOSingleton.createMedia(file);

	// calling next middleware
	next();
});

const deleteSingleImageFromLib = ErrorsWrapper(async (req, res, next) => {
	// check if ther's image to delete from lib
	if (!req.body.old) {
		return next();
	}

	// delete file from media lib
	await MediaLibDAOSingleton.deleteMedia(req.body.old.id);

	// calling next middleware
	next();
});

const deleteManyImagesFromLib = ErrorsWrapper(async (req, res, next) => {
	// check if ther's a images to delete from lib
	if (!req.body.olds) {
		return next();
	}

	// fire a bunch of promises at same time and wait them
	await Promise.all(
		req.body.olds.map((old) => {
			// delete file from media lib
			MediaLibDAOSingleton.deleteMedia(old.id);
		})
	);

	// calling next middleware
	next()
});

const addManyDiskImagesToLib = ErrorsWrapper(async (req, res, next) => {
	// check if there's images in the req payload
	if (!req.files || !("images" in req.files)) {
		return next();
	}

	// fire a bunch of promises at same time and wait them
	await Promise.all(
		req.files.images.map(async (img, i) => {

			// extract file infos from image
			const { path, mimetype, originalname, size } = img;

			// init file object to save it 
			const file = {
				name: originalname,
				url: path,
				mimetype,
				size: size / 1e6,
				uploderId: (req as AuthedReq).user.uid,
			};

			// save file to Media Library
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

const deleteSingleImageFromLocalStorage = ErrorsWrapper(async (req, res, next) => {
	// check if there is a file to delete
	if (!req.body.old) next()

	// delete file from local storage
	await diskRepository.deleteFileFromStorage(req.body.old.path)
})

const deleteManyImagesFromLocalStorage = ErrorsWrapper(async (req, res, next) => {
	// check if there is a file to delete
	if (!req.body.olds) next();

	// fire a bunch of promises at same time and wait them
	await Promise.all(
		(req.body.olds as []).map((file) =>
			diskRepository.deleteFileFromStorage(req.body.old.path) // return promise of deleting a file
		)
	);
})

const single = {
	singleMemoryImageUploadMiddleware,
	singleImageDiskSaverAndCroperMiddlewareFactory,
	addSingleDiskImageToLib,
	deleteSingleImageFromLib,
	deleteSingleImageFromLocalStorage
};

const many = {
	manyMemoryImageUploadMiddleware,
	manyImagesDiskSaverAndCropperMiddlewareFactory,
	addManyDiskImagesToLib,
	deleteManyImagesFromLib,
	deleteManyImagesFromLocalStorage
};

const DiskMediaImages = {
	single,
	many,
};

export default DiskMediaImages;
