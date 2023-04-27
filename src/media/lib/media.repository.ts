import { Media } from "@prisma/client";
import PrismaClientSingleton from "../../databases/prisma/prismaClient.db";
class MediaDAO {

	// create singleton object
	private static instance: MediaDAO;

	// add media client object
	private media = PrismaClientSingleton.media;

	// private constructor
	private constructor() {}

	// static function to get singleton instance
	static getInstance() {
		if (!this.instance) {
			this.instance = new MediaDAO();
		}
		return this.instance;
	}

	// create media
	async createMedia(
		media: Omit<Media, "id" | "createdAt" | "updatedAt">
	): Promise<Media> {
		return this.media.create({ data: media });
	}

	// get media by id
	async getMedia(ID: string): Promise<Media | null> {
		return this.media.findUnique({ where: { id: ID } });
	}

	// get all media's
	async getAllMedias(): Promise<Media[]> {
		return this.media.findMany();
	}


	// update media
	async updateMedia(
		updates: Partial<Media>,
		ID: string
	): Promise<Media | null> {
		return this.media.update({ where: { id: ID }, data: updates });
	}

	// delete media using id
	async deleteMedia(ID: string): Promise<Media | null> {
		return this.media.delete({ where: { id: ID } });
	}
}

const MediaLibDAOSingleton = MediaDAO.getInstance();

export default MediaLibDAOSingleton
