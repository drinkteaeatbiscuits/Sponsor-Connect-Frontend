import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// import { Helmet, HelmetProvider } from 'react-helmet-async';

// import { Auth0Provider } from "@auth0/auth0-react";

import { QueryClient, QueryClientProvider} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';


const queryClient = new QueryClient();


ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
            <App />
        <ReactQueryDevtools />
      </React.StrictMode>
    </QueryClientProvider>,
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
