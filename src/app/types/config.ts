export interface CommonConfType {
  corsOption?: {
    origin: string | string[];
  };
  app?: {
    port: string | number;
    debug: boolean;
    logger_format: string;
  };
  __init: () => CommonConfType;
}

export interface DevConfType extends CommonConfType {
  name: string;
}

export interface ProConfType extends CommonConfType {
  name: string;
}

export interface TestConfType extends CommonConfType {
  name: string;
}

export type AppConf = ProConfType | DevConfType | TestConfType
