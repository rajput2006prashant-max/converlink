import React, { Fragment } from 'react';


import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';







function UserLogin() {
  
  const xyz = useNavigate();

const {register,handleSubmit,formState: { errors }} = useForm()

const myform = (p)=>{
  console.log(p);
  xyz("/landing");
}











  return (
    <Fragment>
 <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">

        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "900px" }}
        >
          <div className="row g-0">

            {/* Left Section */}
            <div className="col-md-6 bg-primary text-white d-flex flex-column justify-content-center p-4 p-lg-5">
              <h1 className="fw-bold mb-3">
                Welcome Back!
              </h1>

              <p className="fs-5">
                Sign in to continue your journey with us.
              </p>

              <div className="mt-4">
                <span className="badge bg-white text-primary rounded-pill p-3">
                  Simple. Secure. Smart.
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-6 p-4 p-lg-5">
              <h2 className="fw-bold text-dark mb-2">
               User Login
              </h2>

              <p className="text-secondary mb-4">
                Please enter your account details
              </p>

              <form  onSubmit={handleSubmit(myform)}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
  <input
                  type="email"
                  className="form-control form-control-lg rounded-3"
                  placeholder="enter email"
                  name='email'
                  {...register("email",{required:true})}
                />
                {errors.email && <p className='text-danger'>Enter Email Id</p>}
              </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>

                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Enter your password"
                  {...register("pass",{required:true,minLength:5,maxLength:10})}
                />
                {errors.pass?.type==='required' && <p className='text-danger'>Password Is Required</p>} 
                {errors.pass?.type==='minLength' && <p className='text-info'>min 5 charector required</p>} 
              {errors.pass?.type==='maxLength' && <p className='text-danger'>max 10 charectors</p>} 
              </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />

                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>

                  <a
                    href="/forgot-password"
                    className="text-primary text-decoration-none small"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                >
                  Login
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Sign Up
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    



     
    </Fragment>
  );
}

export default UserLogin;


