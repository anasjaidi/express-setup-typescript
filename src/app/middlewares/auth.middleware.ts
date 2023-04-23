// async protectRoute(req, res, next) {
// 		let token = req.headers.authorization;

// 		if (!token || !token.startsWith("Bearer") || token.split(" ").length != 2) {
// 			next(AppError.Unauthorized("no token provided"));
// 		} else {
// 			token = token.split(" ")[1];
// 		}

// 		const decoded = await promisify(jwt.verify)(
// 			token,
// 			process.env.JWT_SECRET_KEY
// 		);

// 		const user = await authDAO.getUserByID(decoded.id);

// 		if (!user) {
// 			return next(AppError.Unauthorized("no user found."));
// 		}

// 		if (user?.passwordChangeAt) {
// 			if (parseInt(user.passwordChangeAt.getTime() / 1000, 10) > decoded.iat)
// 				return next(
// 					new AppError(
// 						401,
// 						"password changes after the token was issued please, re signin."
// 					)
// 				);
// 		}

// 		req.user = user;

// 		next();
// 	}