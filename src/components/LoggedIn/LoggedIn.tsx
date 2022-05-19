import { Redirect } from "react-router-dom";

const LoggedIn = ({ isLoggedIn, children }) => {
 if ( isLoggedIn) {
 	return <Redirect to="/dashboard" />;
 }
 return children;
};

export default LoggedIn; 