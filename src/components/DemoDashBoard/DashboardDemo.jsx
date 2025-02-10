import React from 'react'

import './style.css'
const DashboardDemo = () => {
    let menu = document.querySelector('#menu-icon');
    let sidenavbar = document.querySelector('.side-navbar');
    let content = document.querySelector('.content');

    menu.onclick = () => {
        sidenavbar.classList.toggle('active');
        content.classList.toggle('active');
    };

    function showContent(component) {
        var contentElement = document.getElementById('content');

        if (component === 'home') {
            contentElement.innerHTML = '<h1>Home</h1><p>Welcome to the home page!</p>';
        }
        else if (component === 'contact') {
            contentElement.innerHTML = '<h1>Contact</h1><p>Contact information goes here.</p>';
        }
        else if (component === 'information') {
            contentElement.innerHTML = '<h1>Information</h1><p>Additional information is displayed here.</p>';
        }
        else if (component === 'guide') {
            contentElement.innerHTML = '<h1>Guide</h1><p>Helpful guide and instructions are shown in this section.</p>';
        }
    }

    return (
        <>
            <div className="main">
                <div className="side-navbar">
                    <ul>
                        <li>
                            <a href="#">
                                <span className="icon">
                                    <i className="bx bxs-dashboard" />
                                </span>
                                <span className="text">
                                    <h2>Dashboard</h2>
                                </span>
                            </a>
                        </li>
                        <div className="options">
                            <div className="details">
                                <li>
                                    <a href="#"></a>
                                </li>
                                <li onclick="showContent('home')">
                                    <a href="#">
                                        <span className="icon">
                                            <i className="bx bxs-home-circle" />
                                        </span>
                                        <span className="text">Home</span>
                                    </a>
                                </li>
                                <a href="#"></a>
                            </div>
                            <div className="details">
                                <li>
                                    <a href="#"></a>
                                </li>
                                <li onclick="showContent('contact')">
                                    <a href="#">
                                        <span className="icon">
                                            <i className="bx bxs-message-square-detail" />
                                        </span>
                                        <span className="text">Contact</span>
                                    </a>
                                </li>
                                <a href="#"></a>
                            </div>
                            <div className="details">
                                <li>
                                    <a href="#"></a>
                                </li>
                                <li onclick="showContent('information')">
                                    <a href="#">
                                        <span className="icon">
                                            <i className="bx bxs-message-rounded-detail" />
                                        </span>
                                        <span className="text">Information</span>
                                    </a>
                                </li>
                                <a href="#"></a>
                            </div>
                            <div className="details">
                                <li>
                                    <a href="#"></a>
                                </li>
                                <li onclick="showContent('guide')">
                                    <a href="#">
                                        <span className="icon">
                                            <i className="bx bxs-user" />
                                        </span>
                                        <span className="text">Guide</span>
                                    </a>
                                </li>
                                <a href="#"></a>
                            </div>
                        </div>
                    </ul>
                </div>
                <div className="content">
                    <div className="top-navbar">
                        <div className="bx bx-menu" id="menu-icon" />
                    </div>
                    <div className="contents" id="content">
                        <h1>Welcome</h1>
                    </div>
                </div>
            </div>

        </>

    )
}

export default DashboardDemo