import { Redirect } from "react-router-dom";
import AdminDashboard from "../../pages/Admin/Dashboard/AdminDashboard";
import AdminSettings from "../../pages/Admin/Settings/AdminSettings";
import Dashboard from "../../pages/Dashboard/Dashboard";
import DashboardBusiness from "../../pages/DashboardBusiness/DashboardBusiness";
import Login from "../../pages/Login/Login";

const WhichSettings = ({ isLoggedIn, isAdmin, children }) => {
	if (!isLoggedIn) {
		return <Login />;
	}


	if(isAdmin){
		return <AdminSettings />
	}

 	return children;

};

export default WhichSettings;