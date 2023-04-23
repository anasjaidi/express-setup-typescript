import { ErrorsWrapperRequestHandlerParam } from '../types/errors';


const ErrorsWrapper: ErrorsWrapperRequestHandlerParam = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

export default ErrorsWrapper
