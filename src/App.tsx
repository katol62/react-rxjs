import React, {useEffect} from 'react';
import './App.css';
import {useAuthState} from "./store/hooks";
import {authService} from "./store/authService";

function App() {

    const [auth, updateAuth] = useAuthState();

    useEffect( () => {
		console.log(auth.authenticated);
	}, [auth])

	const login = (event: any) => {
		event.preventDefault();
		processLogin();
	}

	const processLogin = async () => {
    	try {
    		await authService.login('79788102131', '123');
    		await authService.me();
		} catch (e) {
			console.log(e);
		}
	}

	const logout = (event: any) => {
    	event.preventDefault();
		processLogOut()
	}

	const processLogOut = async () => {
    	try {
    		await authService.logout();
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className="App">
			{auth.authenticated
				?
					<div>
						<div>
							User phone: {auth.user?.phone}
						</div>
						<div>
							<button onClick={logout}>Logout</button>
						</div>
					</div>
				:
					<div>
						<button onClick={login}>Login</button>
					</div>
			}
		</div>
	);
}

export default App;
