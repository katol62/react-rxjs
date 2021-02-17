import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {IBaseResponse} from "../interfaces";
import qs from "qs";
import {authService} from "../store/authService";

export enum EMethod {
	GET= 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE'
}

export const contentTypes = {
	json: 'application/json',
	form: 'application/x-www-form-urlencoded',
	multipart: 'multipart/form-data',
};

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
	authorized?: boolean;
	contentType?: string;
}

const defaultConfig: ExtendedAxiosRequestConfig = {
	authorized: true,
	contentType: contentTypes.json
}

const defaultUrl: string = process.env.REACT_APP_PUBLIC_URL ? `${process.env.REACT_APP_PUBLIC_URL}/api/` : `/api/`;

class HttpClient{
	protected readonly instance: AxiosInstance;

	constructor(baseUrl?: string) {
		this.instance = axios.create({
			url: baseUrl ? baseUrl : defaultUrl
		});
		this.initializeResponseInterceptor();
	}

	private initializeResponseInterceptor = () => {
		this.instance.interceptors.response.use(
			this.handleResponse,
			this.handleResponseError,
		);
		this.instance.interceptors.request.use(
			this.handleRequest,
			this.handleError,
		);
	};

	private handleResponse = (response: AxiosResponse) => {
		return response;
	}

	private handleError = (error: any) => {
		Promise.reject(error).then(r => console.log(r));
	}

	private handleResponseError = async (error: AxiosError) => {
		const request = error.config;
		if (error.response?.status === 401) {
		}
		return Promise.reject(error).then(r => console.log(r));
	}

	private handleRequest = (config: ExtendedAxiosRequestConfig) => {
		config.headers['Content-Type'] = config.contentType;
		config.headers['Accept'] = '*/*';
		if (config.authorized) {
			const store = authService.getValue();
			config.headers['x-access-token'] = `${store.token}`;
			config.headers['Authorization'] = `Bearer ${store.token}`;
		}
		let data = config.data;
		if (config.contentType === contentTypes.form) {
			data = qs.stringify(data)
		}
		if (config.method === 'GET') {
			config.params = data;
			config.data = null;
		} else {
			config.data = data;
		}

		return config;
	};

	private async request<T extends IBaseResponse>(method: EMethod, endpoint: string, config?: ExtendedAxiosRequestConfig): Promise<T> {
		const updatedConfig = {
			...defaultConfig,
			...config,
			method: method,
			url: endpoint
		}

		try {
			const response: AxiosResponse = await this.instance(updatedConfig);
			if (response && response.data) {
				return response.data;
			} else {
				const resp = {
					success: false
				} as T;
				return resp as T;
			}
		} catch (e) {
			return e.response ? e.response : e;
		}

	}

	public async GET<T extends IBaseResponse>(endpoint: string, options?: any): Promise<T> {
		return this.request(EMethod.GET, endpoint, options);
	}

	public POST<T extends IBaseResponse>(endpoint: string, options?: any): Promise<T> {
		return this.request(EMethod.POST, endpoint, options);
	}

	public async PUT<T extends IBaseResponse>(endpoint: string, options?: any): Promise<T> {
		return this.request(EMethod.POST, endpoint, options);
	}

}

export const httpClient = new HttpClient();
