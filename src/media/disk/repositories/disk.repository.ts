import fs from 'fs/promises'

class DiskRipository {
  private static instance: DiskRipository;

  private constructor() {}

  async saveFileToDiskStorage(buffer: Buffer, path: string) {
    return fs.writeFile(path, buffer);
  }

  async deleteFileFromStorage(path: string) {
    return fs.unlink(path);
  }
}