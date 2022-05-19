import { Redirect } from "react-router-dom";
import Login from "../../pages/Login/Login";

const Protected = ({ isLoggedIn, children }) => {
if (!isLoggedIn) {
 return <Login />;
 }
 return children;
};

export default Protected;