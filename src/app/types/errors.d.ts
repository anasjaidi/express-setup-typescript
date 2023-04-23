import { NextFunction, Response, Request, RequestHandler } from "express";



export type ErrorsWrapperRequestHandlerParam = (fn: (req : Request, res : Response, next: NextFunction) => Promise<void>) => RequestHandler

export type EnvModesErrorDispatcher = (err: AppError, res: Response) => void

