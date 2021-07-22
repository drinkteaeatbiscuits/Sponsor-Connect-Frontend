import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

import { QueryClient, QueryClientProvider} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';


const queryClient = new QueryClient();

ReactDOM.render(
  <Auth0Provider
    domain="dev-dteb123.eu.auth0.com"
    clientId="3wEcaSnm1K9pgKq3SzWjuBZiONKF6US0"
    redirectUri={window.location.origin}
    audience="https://dev-dteb123.eu.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
  >
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <App />
        {/* <ReactQueryDevtools initialIsOpen /> */}
      </React.StrictMode>
    </QueryClientProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
