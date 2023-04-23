import { Request } from "express";

export interface AuthRequest extends Request {
	user?: any;
}

export type DecodedToken = {
	id: string;
	iat: number;
	exp: number;
};
