
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";
import { toast,ToastContainer } from 'react-toastify';



function AdminDashboardpage() {

    const [admin, updateadmin] = useState([])
    const getadmin = () => {
        axios.get("http://localhost:8700/admin").then((d) => {
            console.log(d);
            updateadmin(d.data);
        })
    }

    useEffect(() => {
        getadmin();
    }, [])


const deletepro = (myid)=>{
    console.log(myid)
    axios.delete(`http://localhost:8700/admin/${myid}`).then((r)=>{
        toast.success("user deleted successfully",{autoClose:2000,position:"top-center",theme:'dark'});
        getadmin();
    })
}



      const [user, updateuser] = useState([])
    const getuser = () => {
        axios.get("http://localhost:8700/user").then((d) => {
            console.log(d);
            updateuser(d.data);
        })
    }

    useEffect(() => {
        getuser();
    }, [])


    
const deleteprou = (myid)=>{
    console.log(myid)
    axios.delete(`http://localhost:8700/user/${myid}`).then((r)=>{
        toast.success("user deleted successfully",{autoClose:2000,position:"top-center",theme:'dark'});
        getuser();
    })
}

     const [NewEnuiry, updateNewEnuiryt] = useState([])
    const getNewEnuiry = () => {
        axios.get("http://localhost:8700/NewEnuiry").then((d) => {
            console.log(d);
            updateNewEnuiryt(d.data);
        })
    }

    useEffect(() => {
        getNewEnuiry();
    }, [])

  return (
    <div className="container-fluid mt-3">

      {/* Dashboard Cards and Right Side Cards */}
      <div className="row">

        {/* Left Side Cards */}
        <div className="col-md-9">
          <div className="row">

            <div className="col-md-4">
              <div className="card text-bg-primary mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Admins</h5>
                  <p className="card-text h1">{admin.length}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-bg-success mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text h1">{user.length}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-bg-danger mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Projects</h5>
                  <p className="card-text h1">{NewEnuiry.length}</p>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card text-bg-danger mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Company Overview</h5>
                  <p className="card-text">Welcome to Admin Dashboard.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-bg-danger mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">New Enquiries</h5>
                  <p className="card-text h1">{NewEnuiry.length}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side Cards */}
        <div className="col-md-3">
          <div className="row">

<ToastContainer/>
            <div className="col-md-12">
              <div className="card text-bg-danger mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Primary Card</h5>
                  <p className="card-text">Card content.</p>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card text-bg-danger mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Secondary Card</h5>
                  <p className="card-text">Card content.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Admin List - Full Width */}
      <div className="row">
        <div className="col-md-12">

          <div className="card text-bg-primary mb-3 shadow">
            <div className="card-body">

              <h5 className="card-title mb-3">Admin List <FaListOl/></h5>

              <div className="table-responsive">
                <table className="table table-primary table-hover table-bordered align-middle ">

                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Role</th>
                      <th scope="col">Comments</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {admin.map((d,a=1)=> {
                      return(
                      <tr>
                        <th scope="row">{++a }</th>
                        <td>{d.username}</td>
                        <td>{d.email}</td>
                        <td>{d.phone}</td>
                        <td>{d.gender}</td>
                        <td>{d.role}</td>
                        <td>{d.comments}</td>
                        <td>
                          <button className="btn btn-sm btn-danger"onClick={()=>deletepro(d.id)}>
                          <MdDelete/>
                          </button>
                             <button className="btn btn-sm btn-warning ms-2">
                           <FaEdit/>
                          </button>
                        </td>
                      </tr>
                      )
})}
                  </tbody>

                </table>
              </div>

            </div>
          </div>

        </div>
      </div>


{/* User List - Full Width */}

  <div className="row">
        <div className="col-md-12">

          <div className="card text-bg-primary mb-3 shadow">
            <div className="card-body">

              <h5 className="card-title mb-3">User List <FaListOl/></h5>

              <div className="table-responsive">
                <table className="table table-primary table-hover table-bordered align-middle ">

                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Role</th>
                      <th scope="col">Comments</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {user.map((d,a=1)=> {
                      return(
                      <tr>
                        <th scope="row">{++a }</th>
                        <td>{d.username}</td>
                        <td>{d.email}</td>
                        <td>{d.phone}</td>
                        <td>{d.gender}</td>
                        <td>{d.role}</td>
                        <td>{d.comments}</td>
                        <td>
                          <button className="btn btn-sm btn-danger"onClick={()=>deleteprou(d.id)}>
                          <MdDelete/>
                          </button>
                             <button className="btn btn-sm btn-warning ms-2">
                           <FaEdit/>
                          </button>
                        </td>
                      </tr>
                      )
})}
                  </tbody>

                </table>
              </div>

            </div>
          </div>

        </div>
      </div>

      

    </div>
  );
}

export default AdminDashboardpage;
