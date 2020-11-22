const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    filledform:false,
    errors: {},
  };

export default function auth(state=initialState, action) {

    switch (action.type) {
  
      case 'USER_LOADING':
        return {...state, isLoading: true};
  
      case 'USER_LOADED':
        return {...state, isAuthenticated: true, isLoading: false, user: action.user};
  
      case 'LOGIN_SUCCESS':
        localStorage.setItem("token", action.data.token);
        return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

      case 'FORM_FILLED':
        return{...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null,user:action.user,filledform:true}
  
      case 'AUTH_ERROR':
      case 'LOGIN_FAILED':
      case 'LOGOUT_SUCCESS':
        localStorage.removeItem("token");
        return {...state, errors: action.data, token: null, user: null,
          isAuthenticated: false, isLoading: false};
  
      default:
        return state;
    }
  }