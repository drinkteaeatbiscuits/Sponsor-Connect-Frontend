import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import React, { useState } from "react";
import { IonReactRouter } from '@ionic/react-router';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

// import Cookies from 'js-cookie';

import Home from './pages/Home';
import AddItem from './pages/AddItem';
import Login from './pages/Login';
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
import Profiles from './pages/Profiles';
import Profile from './pages/Profile/Profile';
import Opportunities from './pages/Opportunities/Opportunities';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile/EditProfile';
import Billing from './pages/Billing';
import Account from './pages/Account';
import Notifications from './pages/Notifications';
// import MainMenu from './components/MainMenu';
import Subscription from './pages/Subscription';
import Landing from './pages/Landing/Landing';
import Opportunity from './pages/Opportunity/Opportunity';


const stripePromise = loadStripe('pk_test_yQKqjRLkG226jx0QSGsWyFSJ00nWfNPrKh');

export const AuthContext = React.createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
  }>( {} );

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
    
    default:
      return state;
  }
};

const checkIfAuthenticated = async () => {

    const URL = process.env.REACT_APP_API_URL;
    const loginResp = await fetch(URL + "/profiles/auth", {
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

  wasUserHere && ( initialState.isAuthenticated = true); 
  wasUserHere && ( initialState.user = wasUserHere );

  console.log(initialState.user);
  
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
      <IonRouterOutlet  animated={false}>        
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/landing">
          {state.isAuthenticated ? <Dashboard /> : <Landing />}
        </Route>
        <Route exact path="/dashboard">
          {state.isAuthenticated ? <Dashboard /> : <Login />}
        </Route>
        <Route exact path="/login">
          {state.isAuthenticated ? <Dashboard /> : <Login />}
        </Route>
        <Route exact path="/profile/:id/edit">
          {state.isAuthenticated ? <EditProfile /> : <Login />}
        </Route>
        <Route exact path="/profile/:id">
          {state.isAuthenticated ? <Profile /> : <Login />}
        </Route>


        
        {/* <Route exact path="/opportunities">
          {state.isAuthenticated ? <Opportunities /> : <Login />}
        </Route> */}

        <Route exact path="/opportunities/:id">
          {state.isAuthenticated ? <Opportunities /> : <Login />}
        </Route>

        <Route exact path="/opportunity/:id">
          {state.isAuthenticated ? <Opportunity /> : <Login />}
        </Route>

        <Route exact path="/settings">
          {state.isAuthenticated ? <Settings /> : <Login />}
        </Route>
        <Route exact path="/settings/billing">
          {state.isAuthenticated ? <Billing /> : <Login />}
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
        <Route exact path="/menu">
          <Menu />
        </Route>
        <Route exact path="/add-item">
          <AddItem />
        </Route>
        <Route exact path="/profiles">
          <Profiles />
        </Route>
        
        <Route exact path="/create-account">
          {state.isAuthenticated ?  <Dashboard /> : <CreateAccount />}
        </Route>
        
        
      </IonRouterOutlet>
    </IonReactRouter>
    
    </AuthContext.Provider>
    </Elements>
  </IonApp>
  )
};

export default App;
