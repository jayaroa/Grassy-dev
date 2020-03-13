import React, { Component } from 'react';
import { HashRouter,BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import './Custom.scss';
import withAuthentication from './Session/WithAuthentication';

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const ForgotPass = React.lazy(() => import("./views/Pages/ForgotPass"));
const Register = React.lazy(() => import("./views/Pages/Register"));
const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthUser: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem("picnic_cityadmin_cred")) {
      console.log("inside if2");
      this.setState(() => ({ isAuthUser: true }));
    } else {
      console.log("inside else2");
      this.setState(() => ({ isAuthUser: false }));
    }
  }

  render() {
    const {isAuthUser} =this.state;
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/forgotpass" name="Forgot Password" render={props => <ForgotPass {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route  path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
// export default withAuthentication(App);
