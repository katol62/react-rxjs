import {authService, IAuthState} from "./authService";
import {Subscription} from "rxjs";
import {useEffect, useState} from "react";

export const useAuthState = (): [IAuthState, any] => {
	const [auth, setAuth] = useState(authService.getValue());
	useEffect(() => {
		const subscription: Subscription = authService.getState()
			.subscribe((newValue: Partial<IAuthState>) => {
			setAuth(newValue);
		});
		return () => subscription.unsubscribe();
	}, [auth])
	const updateAuth = (s: IAuthState) => {
		authService.updateState(s)
	}
	return [auth, updateAuth];
}
