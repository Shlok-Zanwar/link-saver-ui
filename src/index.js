import 'antd/dist/reset.css';
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import axios from "axios";
import combinedReducer from "./Redux/Reducers/CombinedReducer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { APP_base_url, APP_TOKEN_KEY } from "./Config";
import { message } from "antd";
import { ConfigProvider } from 'antd';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const store = configureStore({
    reducer: combinedReducer,
});

// Shoukd end without '/'
axios.defaults.baseURL = APP_base_url;

axios.defaults.headers.common["Authorization"] = localStorage.getItem(APP_TOKEN_KEY);

// errorComposer will compose a handleGlobally function
const errorComposer = (error, prefixMessage) => {
    const statusCode = error.response ? error.response.status : null;
    const m = error.response ? error.response.data.detail : null;
    const errorMessage = m ? m : error.message;

    if (!statusCode) {
        message.error(prefixMessage + " : Network Error");
        return;
    } else if (errorMessage) {
        message.error(prefixMessage + " : " + errorMessage);
    } else if (statusCode === 404) {
        message.error(prefixMessage + " : Not Found");
    }

    if (statusCode === 401) {
        message.error(prefixMessage + " : Unauthorized");
        localStorage.removeItem(APP_TOKEN_KEY);
        window.location.href = "/login";
    }
};

// apiName comes as a when handling error globally
axios.interceptors.response.use(undefined, (error) => {
    console.log(error);
    error.handleGlobally = (prefixMessage) => {
        errorComposer(error, prefixMessage);
    };

    return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <ConfigProvider
                componentSize='middle'
                direction='ltr'
            >
                <App />
            </ConfigProvider>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();