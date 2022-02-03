import './App.css';
import VacationManagement from './Components/VacationManagement/VacationManagement';
import Vacations from './Components/Vacations/Vacations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter, NavLink } from 'react-router-dom';
import ManagementGraph from './Components/ManagementGraph/ManagementGraph';
import AddDestination from './Components/AddDestination/AddDestination';
import AddVacations from './Components/AddVacations/AddVacations';
import EditVacation from './Components/EditVacation/EditVacation';

function App() {
    return (
        <div className="App">
                <h1>The Vacations Board</h1>
                
                <BrowserRouter>
                    <NavigationLinks /> 
                    <Routing />
                </BrowserRouter>
             
        </div>
    );
}

function NavigationLinks() {
    return (
        <nav>
            <NavLink to="/login">Login</NavLink>&nbsp;|&nbsp;
            <NavLink to="/register">Register</NavLink>&nbsp;|&nbsp;
            <NavLink to="/logout">Logout</NavLink>
        </nav>
    );
}

function Routing() {
    return (
        <Switch>
            <Route path="/vacation-management" exact component={VacationManagement} />
            <Route path="/vacation-management-graph" exact component={ManagementGraph} />
            <Route path="/login" exact component={Login} />
            <Route path="/logout" exact component={logout} /> 
            <Route path="/vacations" exact component={Vacations} />
            <Route path="/register" exact component={Register} />
            <Route path="/add-destination" exact component={AddDestination} />
            <Route path="/add-vacation" exact component={AddVacations} />
            <Route path="/edit-vacation/:id" exact component={EditVacation} />
            <Redirect from="/" exact to="/login" />
            <Redirect from="*" exact to="/login" />
        </Switch>
    );
}

function logout() {
    localStorage.clear();
    return(<Redirect to="/login" />)
}

export default App;
