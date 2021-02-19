let timer;

export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        });
    },

    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        });
    },
    async auth(context, payload) {
        const mode = payload.mode;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-FoH7UYGad_1nQ5_cz00NoTzkK_yB908'
        if (mode === 'signup') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-FoH7UYGad_1nQ5_cz00NoTzkK_yB908'
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                 email: payload.email,
                 password: payload.password,
                 returnSecureToken: true
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(response.message || 'Failed to authenticate.');
            throw error;
        }

        // prepare the expiration time and set to local storage
        const expiresIn = +responseData.expiresIn * 1000; //multiply 1000 for convert sec to milisec
        // const expiresIn = 5000; // 5 sec for testing
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        // auto logout if token expire
        timer = setTimeout(function() {
            context.dispatch('autoLogout')
        }, expiresIn);

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId
        })
    },

    makeUserLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        // check token time expire if yes then stop the user to login
        const expireIn = +tokenExpiration - new Date().getTime();
        if (expireIn < 0) {
            return;
        }

        setTimeout(function() {
            context.dispatch('autoLogout');
        }, expireIn)

        if (token && userId) {
            context.commit('setUser', {
                token: token,
                userId: userId
            });
        }
    },

    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');
        clearTimeout(timer)
        context.commit('setUser', {
            token: null,
            userId: null
        })
    },
    autoLogout(context ) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};