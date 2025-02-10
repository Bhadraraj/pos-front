import React, { useEffect, useState } from 'react';

function Profile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get user data from localStorage directly
        const storedData = localStorage.getItem('userData');

        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile ms-3">
            <p className='mb-0'>ID : {userData.UserID}  | Name : {userData.UserFname}  </p>
        </div>
    );
}

export default Profile;
