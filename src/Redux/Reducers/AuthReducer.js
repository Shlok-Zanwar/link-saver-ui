const initialState = () => {
    // Process data if any !!

    var state = {
        isAuthenticated: false,
        user: {},
    }

    return state;
}

const authReducer = (state = initialState(), action) => {
    switch (action.type) {
        case 'auth/login':
            // newState = {
            //     isAuthenticated: true,
            //     ...action.payload
            // };
            return {
                ...state,
                isAuthenticated: true,
                ...action.payload
            };
        
        case 'auth/logout':
            return {
                ...state,
                isAuthenticated: false,
                user: {},
            };
        
        default:
            return state;
    }
}

export default authReducer;