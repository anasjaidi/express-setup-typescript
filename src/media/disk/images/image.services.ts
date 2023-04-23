// class DiskMediaImages {
//   constructor() {

import AppError from "../../../app/errors/AppError";
import ErrorsWrapper from "../../../app/errors/ErrorsWrapper";
import MediaLibDAOSingleton from "../../lib/media.repository";
import uploaderFactory from "../conf/diskMedia.conf";
import { AuthedReq } from "../conf/diskMediaConf";

//   }

// }

const singleMemoryImageUploadMiddleware = uploaderFactory(
	"MEMORY",
	"image/",
	null,
	null,
	100 * 1024 * 1024
).single("image");

const addDiskImageToLib = ErrorsWrapper(async (req, res, next) => {
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

const addDiskImagesToLib = ErrorsWrapper(async (req, res, next) => {
	if (!req.files ||  !('images' in req.files)) {
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
  )
	next();
});



const DiskMediaImages = { singleMemoryImageUploadMiddleware , addDiskImageToLib};

export default DiskMediaImages;
