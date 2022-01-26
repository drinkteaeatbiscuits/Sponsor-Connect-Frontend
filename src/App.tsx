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
import Account from './pages/Account/Account';
// import Notifications from './pages/Notifications';
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
import TextEditor from './components/TextEditor/TextEditor';
import NewTextEditor from './pages/NewTextEditor/NewTextEditor';
import ProfileImages from './pages/ProfileImages/ProfileImages';
import EditProfileDescription from './pages/EditProfile/EditProfileDescription';

import Geocode from "react-geocode";
import RangeTest from './pages/RangeTest';
import NotificationSettings from './pages/NotificationSettings/NotificationSettings';
import Notifications from './components/Notifications/Notifications';
import { colorWandOutline } from 'ionicons/icons';
import NewsArticles from './pages/Admin/NewsArticles/NewsArticles';
import BookConsultation from './pages/BookConsultation/BookConsultation';
import DashboardBusiness from './pages/DashboardBusiness/DashboardBusiness';

Geocode.setApiKey("AIzaSyBVk9Y4B2ZJG1_ldwkfUPfgcy48YzNTa4Q");
const stripePromise = loadStripe('pk_test_yQKqjRLkG226jx0QSGsWyFSJ00nWfNPrKh');

export const AuthContext = React.createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
}>({});

const initialState = {
  isAuthenticated: false,
  user: null,
  currentLocation: null,
  profile: null
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

  return profileInfo?.statusCode ? false : profileInfo;

}

const App: React.FC = () => {

  const getLocationPlaceName = (lat, long) => {

    setCheckingLocationPlaceName(true);

		Geocode.fromLatLng(lat, long).then(
			(response) => {
			const address = response.results[0].formatted_address;
			let city, state, country;
			for (let i = 0; i < response.results[0].address_components.length; i++) {
				for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
				switch (response.results[0].address_components[i].types[j]) {
					case "locality":
					city = response.results[0].address_components[i].long_name;
					break;
					case "administrative_area_level_1":
					state = response.results[0].address_components[i].long_name;
					break;
					case "country":
					country = response.results[0].address_components[i].long_name;
					break;
				}
				}
			}

			setFromLocation({ ...fromLocation, "city": city});
			
			},
			(error) => {
				console.error(error);
			}
		);
	}

  const doesLocationCookieExist = () => {

    if (document.cookie.split(';').some((item) => item.trim().startsWith('user_location='))) {
      return true;
    }
    return false;

  }



  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [wasUserHere, setWasUserHere] = useState<any>("");
  const [currentLocation, setCurrentLocation] = useState<any>("");
  const [fromLocation, setFromLocation] = useState<any>({});
  const [checkUser, setCheckUser] = useState<any>(false);
  const [checkingLocation, setCheckingLocation] = useState<any>(false);
  const [checkingLocationPlaceName, setCheckingLocationPlaceName] = useState<any>(false);

  useEffect(() => {

    !wasUserHere && checkIfAuthenticated().then( (data) => { 
      
      setWasUserHere(data); 
      setCheckUser(true); 

    } );

    !doesLocationCookieExist() && !checkingLocation && currentLocation.length <= 0 && navigator.geolocation.getCurrentPosition(function(position) {
    
      setCurrentLocation([
        {"lat": position.coords.latitude, "long": position.coords.longitude}
      ]);
    
      setFromLocation( { lat: position.coords.latitude, long: position.coords.longitude } );

      setCheckingLocation(true);

    });

    !doesLocationCookieExist() && !checkingLocationPlaceName && Object.keys(fromLocation).length > 0 && !fromLocation.city && getLocationPlaceName(fromLocation.lat, fromLocation.long);

    !doesLocationCookieExist() && Object.keys(fromLocation).length > 0 && fromLocation.city && (initialState.currentLocation = fromLocation);

    !doesLocationCookieExist() && Object.keys(fromLocation).length > 0 && fromLocation.city && (document.cookie = "user_location=" + JSON.stringify({lat: fromLocation.lat, long: fromLocation.long, city: fromLocation.city }) + ";max-age=" + 60*60*24 );

    // doesLocationCookieExist() && Object.keys(fromLocation).length <= 0 && setFromLocation(JSON.parse( document.cookie.split('; ').find(row => row.startsWith('user_location='))?.split('=')[1] || "" ));
    
    doesLocationCookieExist() && (initialState.currentLocation = JSON.parse( document.cookie.split('; ').find(row => row.startsWith('user_location='))?.split('=')[1] || "" ));

  }, [currentLocation, fromLocation, state.isAuthenticated, doesLocationCookieExist()]);

  
  // console.log(state.isAuthenticated);

  wasUserHere && (initialState.isAuthenticated = true);
  wasUserHere && (initialState.user = wasUserHere);

  
  const history = useHistory();

  // console.log(state?.user?.accountType);

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
           
            { state?.user?.profile && <Notifications /> }

            <IonRouterOutlet>

              <Route exact path="/">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <Landing />}
              </Route>

              <Route exact path="/sports">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <OnBoardingSport />}
              </Route>

              <Route exact path="/business">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <OnBoardingBusiness />}
              </Route>

              <Route exact path="/landing">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <Landing />}
              </Route>

              <Route exact path="/create-account-sports">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <CreateAccount />}
              </Route> 

              <Route exact path="/create-account-business">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <CreateAccountBusiness />}
              </Route> 

              <Route exact path="/dashboard">

                { state.isAuthenticated ? ( state.user.profile ? <Dashboard /> : <DashboardBusiness /> ) : ( checkUser && <Redirect to="/login" /> ) }

              </Route>

              <Route exact path="/login">
                { state.isAuthenticated ? <Redirect to="/dashboard" /> : ( checkUser && <Login />) }
              </Route>

               <Route exact path="/profile/:id">
                {state.isAuthenticated ? <Profile /> : (checkUser && <Redirect to="/login" />)}
                </Route> 

               <Route exact path="/profile/:id/edit">
                {state.isAuthenticated ? <EditProfile /> : (checkUser && <Redirect to="/login" />)}
              </Route>

               <Route exact path="/manage-profile-images">
                {state.isAuthenticated ? <ProfileImages /> : (checkUser && <Redirect to="/login" />)}
              </Route>

               <Route exact path="/edit-profile-description">
                {state.isAuthenticated ? <EditProfileDescription /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              
              
               <Route exact path="/opportunities/:id">
                {state.isAuthenticated ? <Opportunities /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/opportunity/:id">
                {state.isAuthenticated ? <Opportunity /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/add-opportunity/:id">
                {state.isAuthenticated ? <AddOpportunity /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/edit-opportunity/:id">
                {state.isAuthenticated ? <EditOpportunity /> : (checkUser && <Redirect to="/login" />)}
              </Route>


              <Route exact path="/search-opportunities">
                {state.isAuthenticated ? <SearchOpportunities /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              
              <Route exact path="/settings/billing">
                {state.isAuthenticated ? <Billing /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              <Route exact path="/subscribe">
                {state.isAuthenticated ? <Subscribe /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              <Route exact path="/settings/subscription">
                {state.isAuthenticated ? <Subscription /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              <Route exact path="/settings/account">
                {state.isAuthenticated ? <Account /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              <Route exact path="/settings/notifications">
                {state.isAuthenticated ? <NotificationSettings /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              
              <Route exact path="/settings">
                {state.isAuthenticated ? <Settings /> : (checkUser && <Redirect to="/login" />)}
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
                {state.isAuthenticated ? <Profiles /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/book-consultation">
                {state.isAuthenticated ? <BookConsultation /> : (checkUser && <Redirect to="/login" />)}
              </Route>


              <Route exact path="/admin/news-feed">
                <NewsArticles />
              </Route>

              <Route exact path="/the-dugout">
                <Landing />
              </Route>


              <Route exact path="/new-upload">
                <NewUpload />
              </Route>

              <Route exact path="/text-editor">
                <NewTextEditor />
              </Route>

              <Route exact path="/range-test">
                <RangeTest />
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
