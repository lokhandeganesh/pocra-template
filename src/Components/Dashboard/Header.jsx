import React from 'react'
import "./Sidebar.css"
import agri_logo from "../../assets/logo.png"
import emblum from "../../assets/emblum.png"

function Header() {
    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>

                    <div id="title-grid" >
                        <h1 id="title">नानाजी देशमुख कृषि संजीवनी प्रकल्प</h1>
                    </div>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    {/* Navbar Search */}
                    <li class="dropdown dropdown-quick-sidebar-toggler">
                        <img src={emblum} style={{ height: 50, width: 50 }} alt='Emblum of India' />

                        <img src={agri_logo} style={{ height: 50, width: 50 }} alt='Dept of Agri' />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Header;