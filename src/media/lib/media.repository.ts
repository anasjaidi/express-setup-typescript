import { Media } from "@prisma/client";
import PrismaClientSingleton from "../../database/prismaClient.db";
class MediaDAO {
	private static instance: MediaDAO;

	private media = PrismaClientSingleton.media;

	private constructor() {}

	static getInstance() {
		if (!this.instance) {
			this.instance = new MediaDAO();
		}
		return this.instance;
	}

	async createMedia(
		media: Omit<Media, "id" | "createdAt" | "updatedAt">
	): Promise<Media> {
		return this.media.create({ data: media });
	}

	async getMedia(ID: string): Promise<Media | null> {
		return this.media.findUnique({ where: { id: ID } });
	}

	async getAllMedias(): Promise<Media[]> {
		return this.media.findMany();
	}

	async updateMedia(
		updates: Partial<Media>,
		ID: string
	): Promise<Media | null> {
		return this.media.update({ where: { id: ID }, data: updates });
	}

	async deleteMedia(ID: string): Promise<Media | null> {
		return this.media.delete({ where: { id: ID } });
	}
}

const MediaLibDAOSingleton = MediaDAO.getInstance();

export default MediaLibDAOSingleton
