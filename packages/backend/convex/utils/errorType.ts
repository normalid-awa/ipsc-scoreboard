export enum AppErrorCode {
	Unauthorized = 401,
	NotFound = 404,
}

export interface AppError {
	message: string;
	code: AppErrorCode;
}
