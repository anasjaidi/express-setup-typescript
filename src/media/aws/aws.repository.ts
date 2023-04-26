import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

class S3_Services {
	private s3Client: S3Client;
	private readonly prefix: String = "https://s3.amazonaws.com/robin.dev/";

	private static instance : S3_Services;
	private constructor() {
		this.s3Client = new S3Client({});
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new S3_Services();
		}
	}

	async uploadFileToS3(file: any, useID: String): Promise<string> | never {
		const param = {
			Bucket: process.env.AWS_BUCKET_NAME!,
			Key: `uploads/img-${useID}-${Date.now()}-${file.originalname}`,
			Body: file.buffer,
		};

		await this.s3Client.send(new PutObjectCommand(param as any));

		return param.Key + this.prefix;
	}

  async deleteFileFromS3(Key: string)  {
    const param = {
			Bucket: process.env.AWS_BUCKET_NAME!,
      Key,
		};

    return this.s3Client.send(new DeleteObjectCommand(param))
  }
}

const s3 = S3_Services.getInstance();

export default s3;
