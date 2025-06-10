export enum AppErrorCode {
	Unauthorized = 401,
}

export interface AppError {
	message: string;
	code: AppErrorCode;
}
