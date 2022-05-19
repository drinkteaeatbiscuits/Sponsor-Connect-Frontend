import { Redirect } from "react-router-dom";
import Login from "../../pages/Login/Login";

const LoggedInAdmin = ({ isLoggedIn, isAdmin, children }) => {
 if ( !isLoggedIn ) {
 	return <Login />;
 } 
 
 if ( !isAdmin ) {
 	return <Redirect to="/dashboard" />;
 }
 
 return children;

};

export default LoggedInAdmin; 