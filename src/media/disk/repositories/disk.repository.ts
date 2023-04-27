import fs from 'fs/promises'

class DiskRipository {

  // create singleton object
  private static instance: DiskRipository;

  // private constructor
  private constructor() {}

  // static function to return only the same instance
  static getInstance(): DiskRipository {
    if (!this.instance) {
      this.instance = new DiskRipository()
    }
    return this.instance;
  }

  // save buffer to path 
  async saveFileToDiskStorage(buffer: Buffer, path: string) {
    return fs.writeFile(path, buffer);
  }

  // dlete file located in the path
  async deleteFileFromStorage(path: string) {
    return fs.unlink(path);
  }
}

const diskRepository: DiskRipository = DiskRipository.getInstance();

export default diskRepository;