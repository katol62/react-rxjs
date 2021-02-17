export interface IUser {
	phone?: string;
	email?: string;
	password?: string;
	verified?: boolean;
	type?: 'super' | 'admin' | 'user';
}

export interface IBaseResponse {
	success?: boolean;
	message?: string;
	data?: any;
	code?: string;
}
