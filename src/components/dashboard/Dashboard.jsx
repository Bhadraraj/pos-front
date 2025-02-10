import React from 'react'
import MostSellingProductGraph from './MostSellingProductGraph'
import CategoryWiseSales from './CategoryWiseSales'
import SalesCardTop from './SalesCardTop'
import '../../styles/forms.css'
import '../../styles/saleCard.css';

const Dashboard = () => {
  return (
    <div className='dashboardView'>

      <SalesCardTop />
      {/* <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="cardBody p-3">

              <MostSellingProductGraph />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="cardBody p-3">
              <CategoryWiseSales />
            </div>
          </div>
        </div>




      </div> */}
    </div>
  )
}

export default Dashboard