import multer from "multer";

// TODO: read it from env vars
const LOCATION = "MEMORY"
const MAX_IMAGE_SIZE = 100 * 1024 * 1024

const imagesBufferUploader = multer.memoryStorage()

const imagesDiskUploader = multer.diskStorage({})

const mediaConfigSelector = (location: "MEMORY" | "DISK") => {
  if (location === "DISK") {
    return imagesDiskUploader
  } else {
    return imagesBufferUploader
  }
}