import { PrismaClient } from "@prisma/client";

class PrismaClientSingleton {
	private static instance: PrismaClient;

	private constructor() {}

	static getInstance() {
		if (!this.instance) {
			this.instance = new PrismaClient();
			this.instance
				.$connect()
				.then(() => {
					console.log("\nPrisma connected successfully ✅!"); // Log the success message
				})
				.catch((error) => {
					console.error(`Error connecting to Prisma: ${error}`);
				});
		}
		return this.instance;
	}
}

export default PrismaClientSingleton.getInstance();
