import { MulterError } from "multer";
import { EnvModesErrorDispatcher } from "../types/errors";

const fieldUnexpected: EnvModesErrorDispatcher = (err, res) => {
  res.status(409).json({
		status: "fail",
		message: `Unexpected field ${(err as MulterError).field || "."}`,
	});
};

const multerErrors = {fieldUnexpected}
export default multerErrors