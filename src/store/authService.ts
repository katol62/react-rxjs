import {BehaviorSubject, Observable} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {AUTH, storage} from "./storage";
import {IBaseResponse, IUser} from "../interfaces";
import {ExtendedAxiosRequestConfig, httpClient} from "../services/httpClient";

export interface IAuthState {
	token?: string | null;
	refreshToken?: string | null;
	authenticated?: boolean;
	user?: IUser | null;
}

export const initialAuthState: IAuthState = {
	token: null,
	refreshToken: null,
	authenticated: false,
	user: null
}

class AuthService {
	private subject: BehaviorSubject<IAuthState>;

	constructor() {
		const state = storage.getItem(AUTH) ? storage.getItem(AUTH) : initialAuthState;
		this.subject = new BehaviorSubject<IAuthState>(state);
	}

	public getState(): Observable<IAuthState> {
		return this.subject.pipe(distinctUntilChanged()) as Observable<IAuthState>;
	}

	public getValue(): IAuthState {
		return this.subject.getValue();
	}

	public updateState(newState: Partial<IAuthState>): void {
		const currentState: IAuthState = this.getValue();
		const nextState = {...currentState, ...newState};
		storage.setItem(AUTH, nextState);
		this.subject.next(nextState);
	}

	public clearState(): void {
		storage.removeItem(AUTH);
		this.subject.next(initialAuthState);
	}

	// API functions
	public async login(login: string, password: string): Promise<IBaseResponse> {
		try {
			const config: ExtendedAxiosRequestConfig = {data: {phone: login, password: password}, authorized: false}
			// const result: IBaseResponse = await httpClient.POST('/api/auth', {payload: {phone: login, password: password}});
			const result: IBaseResponse = await httpClient.POST('/api/auth', config);
			if (!result.success) {
				return {success: false} as IBaseResponse;
			}
			this.updateState({token: result.data.token, authenticated: true, refreshToken: result.data.refreshToken})
			return result
		} catch (e) {
			return {success: false, message: e.message} as IBaseResponse;
		}
	}

	public async me(): Promise<IBaseResponse> {
		try {
			const result: IBaseResponse = await httpClient.GET('/api/me');
			this.updateState({user: result.data})
			return {result} as IBaseResponse;
		} catch (e) {
			console.log(e);
			return {success: false, message: e.message} as IBaseResponse;
		}
	}

	public async logout(): Promise<boolean> {
		this.clearState();
		return new Promise<boolean> ((resolve) => {
			resolve(true)
		})
	}

}

export const authService = new AuthService();
