import React from 'react'

function Noida(props) {
  return (
    <div className='container-fluid bg-primary text-white'>
      <div className='row'>
        <div className='col-12 p-5'>

          <h4>Noida</h4>

          <select className="form-select mb-3">
            {props.studata.map((d, index) => {
              return (
                <option key={index}>
                  {d.name}
                </option>
              )
            })}
          </select>

          <select className="form-select">
            {props.studata.map((d, index) => {
              return (
                <option key={index}>
                  {d.name} - {d.salary * 10}
                </option>
              )
            })}
          </select>

        </div>
      </div>
    </div>
  )
}

export default Noida;