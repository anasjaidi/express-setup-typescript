import fs from 'fs/promises'

class DiskRipository {
  private static instance: DiskRipository;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new DiskRipository()
    }
  }

  async saveFileToDiskStorage(buffer: Buffer, path: string) {
    return fs.writeFile(path, buffer);
  }

  async deleteFileFromStorage(path: string) {
    return fs.unlink(path);
  }
}

const diskRepository = DiskRipository.getInstance();

export default diskRepository;