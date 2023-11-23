import EErrors from "../../services/errors/enums.js";
export const errorHandler =  (error, req, res, next) => {
	console.log(error.cause);
	if (error.code === EErrors.INVALID_TYPES_ERROR)
		res.status(400).send({ status: "error", error });
	else
		res.status(400).send({ status: "error", error: "Unhandled error" });
}