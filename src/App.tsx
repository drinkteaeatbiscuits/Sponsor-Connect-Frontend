import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import React, { useState } from "react";
import { IonReactRouter } from '@ionic/react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';



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
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Subscribe from './pages/Subscribe/Subscribe';
import ProfileImages from './pages/ProfileImages/ProfileImages';
import EditProfileDescription from './pages/EditProfile/EditProfileDescription';

import Geocode from "react-geocode";
import NotificationSettings from './pages/NotificationSettings/NotificationSettings';
import Notifications from './components/Notifications/Notifications';
import BookConsultation from './pages/BookConsultation/BookConsultation';
import DashboardBusiness from './pages/DashboardBusiness/DashboardBusiness';
import Favourites from './pages/Favourites/Favourites';
import DugoutArticles from './pages/DugoutArticles/DugoutArticles';
import DugoutArticle from './pages/DugoutArticle/DugoutArticle';
import DugoutCategories from './pages/DugoutCategories/DugoutCategories';
import useMySubscription from './hooks/useMySubscription';
import PleaseSubscribe from './pages/PleaseSubscribe/PleaseSubscribe';

Geocode.setApiKey(process.env.REACT_APP_GEOCODE_API_KEY);

let stripePK = "";
process.env.REACT_APP_STRIPE_PK && (stripePK = process.env.REACT_APP_STRIPE_PK);
const stripePromise = loadStripe(stripePK);

export const AuthContext = React.createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
}>({});

const initialState = {
  isAuthenticated: false,
  user: null,
  currentLocation: null,
  profile: null,
  mySubscription: {}
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
      state.mySubscription.subscriptionStatus = action.payload
      return {
        ...state,
      }
    }
    case "setFavouriteProfiles": {
      state.user.favouriteProfiles = action.payload
      return {
        ...state 
      }
    }
    case "setFavouriteOpportunities": {
      state.user.favouriteOpportunities = action.payload
      return {
        ...state 
      }
    }
    case "setSavedSearches": {
      state.user.savedSearches = action.payload
      return {
        ...state 
      }
    }
    case "setSearchNow": {
      state.user.searchNow = action.payload
      return {
        ...state 
      }
    }
    case "setCurrentLocation": {
      state.currentLocation = action.payload
      return {
        ...state 
      }
    }
    case "viewedProfile": {
      state.user.viewedProfiles = action.payload
      return {
        ...state 
      }
    }
    case "updateProfileComplete": {
      state.user.profileComplete = action.payload
      return {
        ...state 
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
  const {data: mySubscription, isSuccess: subscriptionSuccess, error: subscriptionError } = useMySubscription();

  useEffect(() => {

    !wasUserHere && checkIfAuthenticated().then( (data) => { 
      
      setWasUserHere(data); 
      setCheckUser(true); 

    } );


    subscriptionSuccess && mySubscription.length > 0 && (initialState.mySubscription = mySubscription[0]);

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

  wasUserHere && (initialState.isAuthenticated = true);
  wasUserHere && (initialState.user = wasUserHere);


  const subscriptionActive = () => {
    if(state?.mySubscription?.subscriptionStatus === 'active'){
      return true
    }else{
      return false
    }
  }

  console.log(state);

  return (

    <IonApp>
      <Elements stripe={stripePromise}>

        <AuthContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          
          <IonReactRouter>
           
            { state?.user?.profile && <Notifications /> }

            <IonRouterOutlet animated={false}>

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

              <Route exact path="/favourites">

                { state.isAuthenticated ? <Favourites /> : ( checkUser && <Redirect to="/login" /> ) }

              </Route>

              <Route exact path="/login">
                { state.isAuthenticated ? <Redirect to="/dashboard" /> : ( checkUser && <Login />) }
              </Route>

              <Route exact path="/profile/view/:id">
                  <Profile />
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

              <Route exact path="/profiles">
                {state.isAuthenticated ? <Profiles /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/book-consultation">
                {state.isAuthenticated ? (subscriptionActive() ? <BookConsultation /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}
              </Route>


              {/* <Route exact path="/admin/news-feed">
                <NewsArticles />
              </Route> */}

              <Route exact path="/the-dugout">
              
                {state.isAuthenticated ? (subscriptionActive() ? <DugoutArticles /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}
                
              </Route>

              <Route exact path="/the-dugout-categories">
                
                {state.isAuthenticated ? (subscriptionActive() ? <DugoutCategories /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}

              </Route>
              
              <Route exact path="/the-dugout/:slug">
                
                {state.isAuthenticated ? (subscriptionActive() ? <DugoutArticle /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}
                
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
