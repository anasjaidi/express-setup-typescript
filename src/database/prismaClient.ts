import { PrismaClient } from "@prisma/client";


class PrismaClientSingleton {
  
  private static instance : PrismaClient;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new PrismaClient()
    }
    return this.instance;
  }
}

export default PrismaClientSingleton.getInstance()