import { APP_TOKEN_KEY } from "../../Config";

export const ar_loginUser = (payload={}) => {
    return {
        type: "auth/login",
        payload: payload,
    };
};

export const ar_logoutUser = (payload={}) => {
    localStorage.removeItem(APP_TOKEN_KEY);
    return {
        type: "auth/logout",
        payload: payload,
    };
};
