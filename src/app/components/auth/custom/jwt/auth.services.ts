import jwt from "jsonwebtoken";
import authDAO from "./auth.repository";
import bcrypt from "bcryptjs";
import AppError from "../../../../errors/AppError";
import { promisify } from "util";
import { newUserObject, userCredantials } from "./auth";
import { User } from "@prisma/client";

class AuthServices {
	private authDAO = authDAO;
	private static instance: AuthServices;

	private constructor() {}

	static getInstance() {
		if (!this.instance) {
			this.instance = new AuthServices();
		}
		return this.instance;
	}

	async signup(user: newUserObject) {
		user.password = await this.hash(user.password, 12);

		const newUser = await this.authDAO.addNewUser(user as User);

		const token = await this.generateToken(
			newUser.uid,
			process.env.JWT_SECRET_KEY!,
			process.env.JWT_EXPIRES_IN!
		);

		return { newUser, token };
	}

	async signin(credentails: userCredantials) {
		const user = await this.authDAO.getUserByEmail(credentails.email);

		if (!user || !(await this.compare(credentails.password, user.password))) {
			throw new AppError(401, "email or password are invalids.");
		}

		const token = await this.generateToken(
			user.uid,
			process.env.JWT_SECRET_KEY!,
			process.env.JWT_EXPIRES_IN!
		);

		return token;
	}

	verifyToken(token: string, SECRET_KEY: string) {
		return jwt.verify(token, SECRET_KEY);
	}

	async hash(payload: string, salt: number) {
		return await bcrypt.hash(payload, salt);
	}

	async compare(candidate: string, member: string) {
		return await bcrypt.compare(candidate, member);
	}

	async generateToken(payload: string, SECRET_KEY: string, EXPIRE_IN: string) {
		return jwt.sign({ id: payload }, SECRET_KEY, { expiresIn: EXPIRE_IN });
	}
}

const authServices: AuthServices = AuthServices.getInstance();

export default authServices;
