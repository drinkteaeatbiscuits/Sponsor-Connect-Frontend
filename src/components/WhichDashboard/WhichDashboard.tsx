import { Redirect } from "react-router-dom";
import AdminDashboard from "../../pages/Admin/Dashboard/AdminDashboard";
import Dashboard from "../../pages/Dashboard/Dashboard";
import DashboardBusiness from "../../pages/DashboardBusiness/DashboardBusiness";
import Login from "../../pages/Login/Login";

const WhichDashboard = ({ isLoggedIn, hasProfile, isAdmin }) => {
	if (!isLoggedIn) {
		return <Login />;
		}

	if (hasProfile) {
	return <Dashboard />
	}

	if(isAdmin){
		return <AdminDashboard />
	}

 	return <DashboardBusiness />;

};

export default WhichDashboard;