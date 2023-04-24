import { User } from "@prisma/client";
import { Request } from "express";
import { File } from "multer";

interface AuthedReq extends Request {
	user: User;
}

export type MulterStorageConfFunctionType = (
	req: AuthedReq,
	file: Express.Multer.File,
	cb: (error: Error | null, destination: string) => void
) => void;

export type MulterConfFilterCallBackType = (
	req: AuthedReq,
	file: File,
	cb: multer.FileFilterCallback
) => void;
