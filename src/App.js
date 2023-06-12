import Header from './Components/Dashboard/Header';
import Sidebar from './Components/Dashboard/Sidebar';
import Footer from './Components/Dashboard/Footer';
import SelectionMenu from "./Components/Selection_Menu/Selection_Dropdown"
import { BrowserRouter as Router, } from "react-router-dom";
function App() {
  return (
    <div class="wrapper">
      <Router>
        <Header />
        <Sidebar />
        {/* <SelectionMenu /> */}
        <Footer />
      </Router>
    </div>
  );
}

export default App;
