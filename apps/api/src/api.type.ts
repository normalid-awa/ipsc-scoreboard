import { StatusCodes } from "http-status-codes";

export type APIError = {
	code: StatusCodes;
	message: string;
	details?: string;
};

export type APIReturn<T> = {
	code: StatusCodes;
	data: T;
	error?: APIError[];
};

export function createSuccessfulAPIReturn<T>(data: T): APIReturn<T> {
	return {
		code: StatusCodes.OK,
		data,
	};
}
