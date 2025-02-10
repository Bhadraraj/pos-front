import React from 'react'
import pageNotFound from '../images/404.png'

const PageNotFound = () => {
  return (
    <div>
     {/* <div className="container "> */}
  <div className="row text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' , width:'100%'}}>
    <div className="col-md-8">
      <img src={pageNotFound} alt="Page Not Found" className="img-fluid" />
    {/* </div> */}
  </div>
</div>

    </div>
  )
}

export default PageNotFound