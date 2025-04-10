import {
	Request,
	Response,
	NextFunction
} from "express"
import { getAuth } from "firebase-admin/auth"

const checkAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization

	if (!authHeader?.startsWith("Bearer "))
		res.status(401).send("Forbidden")
	else {
		const token = authHeader.split("Bearer ")[1]
		try {
			const decoded = await getAuth().verifyIdToken(token)
			req.body.loggedInUser = decoded
			next()
		} catch (error) {
			res.status(401).send("Invalid or expired token")
		}
	}
}

export default checkAuth
