import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import authDAO from "../components/auth/auth.repository";
import { AuthRequest, DecodedToken } from "../types/auth";

async function protectRoute(
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> {
	let token = req.headers.authorization;

	if (!token || !token.startsWith("Bearer") || token.split(" ").length != 2) {
		return next(new AppError(401, "no token provided"));
	} else {
		token = token.split(" ")[1];
	}

	const decoded = jwt.verify(
		token!,
		process.env.JWT_SECRET_KEY!
	) as unknown as DecodedToken;

	const user = await authDAO.getUserByID(decoded.id);

	if (!user) {
		return next(AppError.Unauthorized("no user found."));
	}

	if (user?.passwordChangeAt) {
		if (
			parseInt(
				(user.passwordChangeAt.getTime() / 1000).toString(),
				decoded.iat
			) > decoded.iat
		)
			return next(
				new AppError(
					401,
					"password changes after the token was issued please, re signin."
				)
			);
	}

	req.user = user;

	next();
}

export default protectRoute;
