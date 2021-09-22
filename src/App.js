import logo from './logo.svg';
import './App.css';
import Header from './Components/Dashboard/Header';
import MainContent from './Components/Dashboard/MainContent';
import Sidebar from './Components/Dashboard/Sidebar';
import Footer from './Components/Dashboard/Footer';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Forecast from './Components/ForecastComponent/Forecast';
import NoFound from './Components/NoFound';
import DBTFarmerDashboard from './Components/DBTComponent/DBTFarmerDashboard';
function App() {
  return (
    <div class="wrapper">
      <Router>
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/" component={MainContent} />
          <Route path="/forecast" component={Forecast} />
          <Route exact path="/home" component={MainContent} />
          <Route exact path="/dbtfarmer" component={DBTFarmerDashboard} />
          <Route exact path="/pocra_dashboard" component={MainContent} />
          <Route component={NoFound} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
