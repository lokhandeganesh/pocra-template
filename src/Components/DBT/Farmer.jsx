import React from "react";
import SelectionMenu from "../Selection_Menu/Selection_Dropdown"
import Header from './Components/Dashboard/Header';
import Sidebar from './Components/Dashboard/Sidebar';
import Footer from './Components/Dashboard/Footer';

function Farmer_Page() {
  return (
    <div class="wrapper">
      <Router>
        <Header />
        <Sidebar />
        <SelectionMenu />
        <Footer />
      </Router>
    </div>
  )
}

export default Farmer_Page;