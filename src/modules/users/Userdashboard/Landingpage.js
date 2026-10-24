
import { Fragment } from "react";
import Headerpage from "../../shares/Headerpage";
import Sidebar from "../../shares/Sidebar";
import Footerpage from "../../shares/Footerpage";
import { Outlet } from "react-router-dom";

function Landingpage() {
  return (
    <Fragment>
      <Headerpage />

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-2 m-0 p-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-10 ch">
            <Outlet />

            {/* Footer */}
            <Footerpage />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Landingpage;
