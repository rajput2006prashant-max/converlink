
import { Fragment } from "react";
import Headerpage from "../../AdminShare/Headerpage";
import Sidebarpage from "../../AdminShare/Sidebarpage";
import Footerpage from "../../AdminShare/Footerpage";
import { Outlet } from "react-router-dom";


function AdminLandingpage() {
  return (
    <Fragment>
    
<Headerpage/>
      <div className="container-fluid">
        <div className="row">
       
          <div className="col-2 m-0 p-0">
          <Sidebarpage/>
          </div>

          <div className="col-10 ch">
           <Outlet></Outlet>

         
            <Footerpage></Footerpage>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminLandingpage;
