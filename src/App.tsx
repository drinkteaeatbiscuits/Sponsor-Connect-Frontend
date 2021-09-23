import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import React, { useState } from "react";
import { IonReactRouter } from '@ionic/react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// import Cookies from 'js-cookie';

import Home from './pages/Home';
import AddItem from './pages/AddItem';
import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Menu from './pages/Menu';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/app.scss';

import { useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import Profiles from './pages/Profiles/Profiles';
import Profile from './pages/Profile/Profile';
import Opportunities from './pages/Opportunities/Opportunities';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile/EditProfile';
import Billing from './pages/Billing';
import Account from './pages/Account';
import Notifications from './pages/Notifications';
// import MainMenu from './components/MainMenu';
import Subscription from './pages/Subscription/Subscription';
import Landing from './pages/Landing/Landing';
import Opportunity from './pages/Opportunity/Opportunity';
import OnBoardingSport from './pages/OnBoardingSport/OnBoardingSport';
import OnBoardingBusiness from './pages/OnBoardingBusiness/OnBoardingBusiness';
import AddOpportunity from './pages/Opportunity/AddOpportunity';
import EditOpportunity from './pages/Opportunity/EditOpportunity';
import CreateAccountBusiness from './pages/CreateAccountBusiness/CreateAccountBusiness';
import SearchOpportunities from './pages/SearchOpportunities/SearchOpportunities';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import NewUpload from './pages/NewUpload';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Subscribe from './pages/Subscribe/Subscribe';


const stripePromise = loadStripe('pk_test_yQKqjRLkG226jx0QSGsWyFSJ00nWfNPrKh');

export const AuthContext = React.createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
}>({});

const initialState = {
  isAuthenticated: false,
  user: null,
};

const reducer = (state: any, action: any) => {

  switch (action.type) {
    case "LOGIN":
      let isAuthenticated = false;
      action.payload.status = "Authenticated" ? isAuthenticated = true : isAuthenticated = false;
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      // localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case "setUser": {
      let isAuthenticated = false;
      action.payload.status = "Authenticated" ? isAuthenticated = true : isAuthenticated = false;
      return {
        ...state,
        isAuthenticated: isAuthenticated,
        user: action.payload.user,
      }
    }
    case "setSubscription": {
      return {
        ...state,
        selectedSubscription: action.payload
      }
    }

    default:

    return state;
  }
};

const checkIfAuthenticated = async () => {

  const loginResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/auth", {
    method: "GET",
    credentials: "include",
  });

  
  const profileInfo = await loginResp.json();

  // console.log(profileInfo);

  return profileInfo?.statusCode ? false : profileInfo;

}

const App: React.FC = () => {

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [wasUserHere, setWasUserHere] = useState<any>("");

  useEffect(() => {

    checkIfAuthenticated().then(data => setWasUserHere(data));

  }, []);

  wasUserHere && (initialState.isAuthenticated = true);
  wasUserHere && (initialState.user = wasUserHere);

  // console.log(initialState.user);


  const history = useHistory();


  return (

    <IonApp>
      <Elements stripe={stripePromise}>

        <AuthContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          
          {/* {!state.isAuthenticated ? <p>logged out</p> : <p>logged in</p>} */}
        
          <IonReactRouter>
            <IonRouterOutlet animated={false}>

              <Route exact path="/">
                {state.isAuthenticated ? <Redirect to="dashboard" /> : <Landing />}
              </Route>

              <Route exact path="/sports">
                {state.isAuthenticated ? <Redirect to="dashboard" /> : <OnBoardingSport />}
              </Route>

              <Route exact path="/business">
                {state.isAuthenticated ? <Dashboard /> : <OnBoardingBusiness />}
              </Route>

              <Route exact path="/landing">
                {state.isAuthenticated ? <Dashboard /> : <Landing />}
              </Route>

              <Route exact path="/create-account-sports">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <CreateAccount />}
              </Route> 

              <Route exact path="/create-account-business">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <CreateAccountBusiness />}
              </Route> 

              <Route exact path="/dashboard">
                {state.isAuthenticated ? <Dashboard /> : <Redirect to="login" />}
              </Route>

              <Route exact path="/login">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
              </Route>

               <Route exact path="/profile/:id">
                {state.isAuthenticated ? <Profile /> : <Login />}
                </Route> 

               <Route exact path="/profile/:id/edit">
                {state.isAuthenticated ? <EditProfile /> : <Login />}
              </Route>
              
              
               <Route exact path="/opportunities/:id">
                {state.isAuthenticated ? <Opportunities /> : <Login />}
              </Route>

              <Route exact path="/opportunity/:id">
                {state.isAuthenticated ? <Opportunity /> : <Login />}
              </Route>

              <Route exact path="/add-opportunity/:id">
                {state.isAuthenticated ? <AddOpportunity /> : <Login />}
              </Route>

              <Route exact path="/edit-opportunity/:id">
                {state.isAuthenticated ? <EditOpportunity /> : <Login />}
              </Route>


              <Route exact path="/search-opportunities">
                {state.isAuthenticated ? <SearchOpportunities /> : <Login />}
              </Route>

              
              <Route exact path="/settings/billing">
                {state.isAuthenticated ? <Billing /> : <Login />}
              </Route>
              <Route exact path="/subscribe">
                {state.isAuthenticated ? <Subscribe /> : <Login />}
              </Route>
              <Route exact path="/settings/subscription">
                {state.isAuthenticated ? <Subscription /> : <Login />}
              </Route>
              <Route exact path="/settings/account">
                {state.isAuthenticated ? <Account /> : <Login />}
              </Route>
              <Route exact path="/settings/notifications">
                {state.isAuthenticated ? <Notifications /> : <Login />}
              </Route>
              
              <Route exact path="/settings">
                {state.isAuthenticated ? <Settings /> : <Login />}
              </Route>

              <Route exact path="/reset-password">
                <ResetPassword />
              </Route>
              <Route exact path="/forgot-password">
                <ForgotPassword /> 
              </Route>
              <Route exact path="/menu">
                <Menu />
              </Route>
              <Route exact path="/add-item">
                <AddItem />
              </Route>
              <Route exact path="/profiles">
                <Profiles />
              </Route>


              <Route exact path="/the-dugout">
                <Landing />
              </Route>


              <Route exact path="/new-upload">
                <NewUpload />
              </Route>

              
              <Route>
                <ErrorPage />
              </Route>


            </IonRouterOutlet>
          </IonReactRouter>

        </AuthContext.Provider>
      </Elements>
    </IonApp>
  )
};

export default App;
