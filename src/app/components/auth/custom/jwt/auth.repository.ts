import prismaClientDb from "../../../../../databases/prisma/prismaClient.db";
import { User } from "@prisma/client";

class AuthDAO {
	private user = prismaClientDb.user;

	private static instance: AuthDAO;

	private constructor() {}

	static getInstance() {
		if (!this.instance) {
			this.instance = new AuthDAO();
		}
		return this.instance;
	}

	async getAllUsers() {
		return await this.user.findMany();
	}

	async getFiltredUser(filters: object) {
		return await this.user.findMany({ where: filters });
	}

	async addNewUser(user: User) {
		return await this.user.create({ data: user });
	}

	async getUserByID(ID: string) {
		return await this.user.findFirst({
			where: {
				uid: ID,
			},
		});
	}

	async getUserByEmail(email: string) {
		return await this.user.findFirst({
			where: {
				email: email,
			},
		});
	}

	async deleteUser(ID: string) {
		return await this.user.delete({
			where: {
				uid: ID,
			},
		});
	}
	async updateUser(updates: Partial<User>, ID: string) {
		return await this.user.update({
			where: {
				uid: ID,
			},
			data: updates,
		});
	}
}

const authDAO = AuthDAO.getInstance();

export default authDAO;
