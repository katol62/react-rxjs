export const AUTH: string = 'STORE/auth';
export type STORAGE_TYPE = 'session' | 'local';

class Storage {
	private readonly type: STORAGE_TYPE;

	constructor(type?: STORAGE_TYPE) {
		this.type = type ? type : 'session';
	}

	public getItem(key: string): any {
		const obj = this.type === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
		return obj ? JSON.parse(obj) : null;
	}

	public setItem(key: string, data: any) {
		this.type === 'session' ? sessionStorage.setItem(key, JSON.stringify(data)) : localStorage.setItem(key, JSON.stringify(data));
	}

	public removeItem(key: string): void {
		this.type === 'session' ? sessionStorage.removeItem(key) : localStorage.removeItem(key);
	}

	public clear() {
		this.type === 'session' ? sessionStorage.clear() : localStorage.clear();
	}

}

const defaultType: STORAGE_TYPE = process.env.REACT_APP_STORAGE_TYPE as STORAGE_TYPE ? process.env.REACT_APP_STORAGE_TYPE as STORAGE_TYPE : `session`;

export const storage = new Storage(defaultType);
