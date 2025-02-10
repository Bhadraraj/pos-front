import React from 'react';
import { IoRefreshCircleSharp } from "react-icons/io5";
const RefreshButton = () => {
    const handleRefresh = () => {
        window.location.reload(); // Refresh the page
    };

    return (
        <div>
            <span onClick={handleRefresh} className='btn btn-secondary btn-sm'>
               Refresh  <IoRefreshCircleSharp />
            </span>
        </div>
    );
};

export default RefreshButton;
