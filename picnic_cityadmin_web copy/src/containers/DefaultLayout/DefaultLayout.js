import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import withAuthentication from "./../../Session/WithAuthentication";
import swal from 'sweetalert';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
import Login from "../../views/Pages/Login/Login";

// const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

const logoutStyle = {
  cursor: 'pointer',
  // padding: '0px'
}

class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPaidUser: false
    };
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    localStorage.removeItem("picnic_cityadmin_cred")
    localStorage.removeItem("proFlag")
    this.props.history.push("/login");
  }

  async componentDidMount() {
    console.log("1this.props.history", this.props.history);

    let storage = await localStorage.getItem("picnic_cityadmin_cred");
    console.log("2this.props.history data");

    if (!storage) {
      console.log("this.props.history data", storage);
      this.setState({ storage: null });
      this.props.history.push("/login");
    } else {
      this.setState({ storage });
      var pro = localStorage.getItem('proFlag');
      if (pro == 2) {
        this.props.history.push("/package");
      } else {
        this.setState({ isPaidUser: true });
      }
    }
  }

  handleClick(e) {
    e.preventDefault();
    swal({
      title: "Oops!",
      text: "You dont have any active plan! Please Upgrade",
      icon: "warning",
      dangerMode: true,
    })
      .then(willupgrade => {
        if (willupgrade) {
          swal('', 'You will be redirected to upgrade page', 'success');
        }
      });
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body" >

          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav
                navConfig={navigation}
                {...this.props}
                router={router}
              />
            </Suspense>
            <AppSidebarFooter>
              <a href="javascript:void(0)" className="nav-link" style={logoutStyle} onClick={e => this.signOut(e)}>
                <i className="fa fa-sign-out"> Logout </i>
              </a>
            </AppSidebarFooter>
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => <route.component {...props} />}
                      />
                    ) : null;
                  })}
                  {/* <Redirect from="/" to="/dashboard" /> */}
                  {localStorage.getItem("picnic_cityadmin_cred") &&
                    Object.keys(localStorage.getItem("picnic_cityadmin_cred"))
                      .length > 0 ? (
                      <Redirect from="/" to="/dashboard" />
                    ) : (
                      <Redirect from="/" to="/login" />
                    )}
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
