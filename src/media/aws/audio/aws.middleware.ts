import AppError from "../../../app/errors/AppError";
import ErrorsWrapper from "../../../app/errors/ErrorsWrapper";
import uploaderFactory from "../../conf/diskMedia.conf";
import { AuthedReq } from "../../conf/diskMediaConf";
import s3 from "../aws.repository";
import path from 'path';


const singleMemoryAudioUploadMiddleware = uploaderFactory(
	"MEMORY",
	"audio/",
	"",
	"",
	500 * 1024 * 1024
).single("audio");

const manyMemoryAudioUploadMiddleware = uploaderFactory(
	"MEMORY",
	"audio/",
	"",
	"",
	500 * 1024 * 1024
).fields([{ name: "audio" , maxCount: 5}]);

const uploadSingleAudioToS3Storage = ErrorsWrapper(async (req , res,next) => {
  if (!req.file) {
    return next()
  }

  const audioPath = await s3.uploadFileToS3(
    req.file,
    (req as AuthedReq).user.uid,
    "uploades/audios", // TODO: change location
    "audio"
  )

  req.file.path = audioPath;
  
  next()
});


const uploadManyAudioToS3Storage = ErrorsWrapper(async (req, res,next) => {
    if (!req.files || !("audios" in req.files)) {
			return next();
		}

    
    await Promise.all(req.files.audios.map(async (audio, i) => {
      const audioPath = await s3.uploadFileToS3(
				req.file,
				(req as AuthedReq).user.uid,
				"uploades/audios", // TODO: change location
				"audio"
			);
      if ("audios" in req.files!)
        req.files!.audios[i].path = audioPath;
    }))


		next();
});