
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/Style.css";

import Welcome from "./Welcome";

// Admin pages
import AdminLogin from "./modules/admin/auth/AdminLogin";
import AdminForget from "./modules/admin/auth/AdminForget";
import AdminRegister from "./modules/admin/auth/AdminRegister";
import AdminLandingpage from "./modules/admin/auth/AdminLandingpage";
import ManageServices from './modules/admin/auth/ManageServices';
import AdminDashboardpage from "./modules/admin/auth/AdminDashboardpage";
import ManageProject from "./modules/admin/auth/ManageProject";
import Enquiries from "./modules/admin/auth/Enquiries";
import ManageUser from "./modules/admin/auth/ManageUser";
import MyProfile from "./modules/admin/auth/MyProfile";
import Settings from "./modules/admin/auth/Settings";
import Message from "./modules/admin/auth/Message";
import Notification from "./modules/admin/auth/Notification";
import AdminSearch from "./modules/admin/auth/AdminSearch";


// User pages
import UserLogin from "./modules/users/UserLogin";
import ProtectedRoute from "./modules/users/ProtectedRoute";
import UserRegister from "./modules/users/UserRegister";
import UserForget from "./modules/users/UserForget";


import Landingpage from "./modules/users/Userdashboard/Landingpage";

import Homepage from "./modules/users/Userdashboard/Homepage";
import Aboutpage from "./modules/users/Userdashboard/Aboutpage";
import Servicespage from "./modules/users/Userdashboard/Servicepage";
import ServiceDetails from "./modules/users/Userdashboard/ServiceDetails";

import Projectpage from "./modules/users/Userdashboard/Projectpage";
import Enquiriespage from "./modules/users/Userdashboard/Enquiriespage";
import Contactpage from "./modules/users/Userdashboard/Contactpage";
import Profilepage from "./modules/users/Userdashboard/Profilepage";
import Settingpage from "./modules/users/Userdashboard/Settingpage";
import Notificationpage from "./modules/users/Userdashboard/Notificationpage";
import Messagepage from "./modules/users/Userdashboard/Messagepage";
import Dashboardpage from "./modules/users/Userdashboard/Dashboard";

// Shared page
import Errorpage from "./modules/shares/Errorpage";

function App() {
  return (
    <Routes>
      {/* Welcome */}
      <Route path="/" element={<Welcome />} />

      {/* Admin authentication */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/forget-password" element={<AdminForget />} />
      <Route path="/register" element={<AdminRegister />} />

      {/* Admin layout and dashboard */}
<Route path="/adminlandingpage" element={<AdminLandingpage/>}>

<Route index element={<AdminDashboardpage/>}/>
<Route path="ManageServices" element={<ManageServices/>}/>
<Route path="ManageProject" element={<ManageProject/>}/>
<Route path="Enquiries"  element={<Enquiries/>}/>
<Route path="ManageUser" element={<ManageUser/>}/>
<Route path="MyProfile" element={<MyProfile/>}/>
<Route path="Settings" element={<Settings/>}/>
<Route path="Message" element={<Message/>}/>
<Route path="Notification" element={<Notification/>}/>
<Route path="AdminSearch" element={<AdminSearch/>}/>

<Route path="*" element={<Errorpage />} />
</Route>




      {/* User authentication */}
      
{/* User authentication - public pages */}
<Route path="/user-login" element={<UserLogin />} />
<Route path="/user-forgot" element={<UserForget />} />
<Route path="/user-register" element={<UserRegister />} />

{/* User layout and pages - protected */}
<Route element={<ProtectedRoute />}>
  <Route path="/landing" element={<Landingpage />}>
    <Route index element={<Dashboardpage />} />

    <Route path="home" element={<Homepage />} />
    <Route path="about" element={<Aboutpage />} />
    <Route path="services" element={<Servicespage />} />
    <Route path="service/:id" element={<ServiceDetails />} />

    <Route path="project" element={<Projectpage />} />
    <Route path="enquiries" element={<Enquiriespage />} />
    <Route path="contact" element={<Contactpage />} />
    <Route path="profile" element={<Profilepage />} />
    <Route path="setting" element={<Settingpage />} />
    <Route path="notification" element={<Notificationpage />} />
    <Route path="message" element={<Messagepage />} />

    <Route path="*" element={<Errorpage />} />
  </Route>
</Route>

{/* Invalid URL */}
<Route path="*" element={<Errorpage />}/>
</Routes>

  );
}

export default App;
