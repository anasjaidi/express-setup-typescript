import { NextFunction, Response, Request, RequestHandler } from "express";



export type ErrorsWrapperRequestHandlerParam = (fn: (req, res, next) => Promise<void>) => RequestHandler

export type EnvModesErrorDispatcher = (err: AppError, res: Response) => void

