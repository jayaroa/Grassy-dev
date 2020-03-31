import React, { Component } from 'react';
import { HashRouter, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import './Custom.scss';
import withAuthentication from './Session/WithAuthentication';
// import { messaging } from './init-fcm';
import axios from 'axios';
import cred from './cred.json'
// import { ToastDemo } from './ToastManager';
import { NotificationContainer, NotificationManager } from 'react-notifications';



var path = cred.API_PATH + "admin/";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const Package = React.lazy(() => import("./views/Pages/Package"));
const ForgotPass = React.lazy(() => import("./views/Pages/ForgotPass"));
const Register = React.lazy(() => import("./views/Pages/Register"));

const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthUser: false,
      isPaidUser: false,
      message: {}
    };
  }


  componentDidMount() {
    let user = localStorage.getItem('picnic_cityadmin_cred');
    console.log('this is user', user);
    user = typeof user === 'string' ? JSON.parse(user) : user;
    // messaging.requestPermission()
    //   .then(async function () {
    //     const token = await messaging.getToken();
    //     console.log('this is registration token', token)
    //     await axios.post(path + 'update_fcm', {
    //       fcmToken: token,
    //       id: user.data._id
    //     })
    //     messaging.onTokenRefresh(async () => {
    //       messaging.getToken().then(async (refreshedToken) => {
    //         console.log('Token refreshed.');
    //         // Indicate that the new Instance ID token has not yet been sent to the
    //         // app server.


    //         await axios.post(path + 'update_fcm', {
    //           fcmToken: refreshedToken,
    //           id: user.data._id
    //         })
    //         // ...
    //       }).catch((err) => {
    //         console.log('Unable to retrieve refreshed token ', err);
    //         // showToken('Unable to retrieve refreshed token ', err);
    //       });
    //     });
    //   })
    //   .catch(function (err) {
    //     console.log("Unable to get permission to notify.", err);
    //   });
    // navigator.serviceWorker.addEventListener("message", (message) => {
    //   console.log('this is message', message)
    //   message.data && NotificationManager.info(message.data['firebase-messaging-msg-data'].notification.title, 'Grassy App')
    //   this.setState({
    //     message
    //   })
    //   // const { addToast } = useToasts()
    //   // addToast('you received update Successfully', { appearance: 'success' })
    //   console.log('this is message', message)
    // });
    var admincred = localStorage.getItem("picnic_cityadmin_cred");
    if (localStorage.getItem("picnic_cityadmin_cred")) {
      console.log("inside if2", admincred);
      var pro = localStorage.getItem('proFlag');
      console.log('pro', pro);
      this.setState(() => ({ isAuthUser: true, isPaidUser: true }));
    } else {
      console.log("inside else2");
      this.setState(() => ({ isAuthUser: false }));
    }
  }

  render() {
    const { isAuthUser, isPaidUser } = this.state;
    console.log('isPaidUser', isPaidUser);
    console.log('this is this.state', this.state)
    console.log('this is notification title ', this.state.message.data && this.state.message.data['firebase-messaging-msg-data'].notification.title)
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <React.Fragment>
            {this.state.message.data ? <NotificationContainer />
              // <ToastDemo content={this.state.message.data['firebase-messaging-msg-data'].notification} />
              : ''}
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
              <Route exact path="/forgotpass" name="Forgot Password" render={props => <ForgotPass {...props} />} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
              <Route exact path="/package" name="Package Page" render={props => <Package {...props} />} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
            </Switch>
          </React.Fragment>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
// export default withAuthentication(App);



// import React, { Component } from 'react';
// import { HashRouter, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// // import { renderRoutes } from 'react-router-config';
// import './App.scss';
// import './Custom.scss';
// import withAuthentication from './Session/WithAuthentication';
// import { messaging } from './init-fcm';
// import axios from 'axios';
// import cred from './cred.json';
// import { useToasts } from 'react-toast-notifications'


// var path = cred.API_PATH + "admin/";

// const loading = () => (
//   <div className="animated fadeIn pt-3 text-center">Loading...</div>
// );

// // Containers
// const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// // Pages
// const Login = React.lazy(() => import("./views/Pages/Login"));
// const Package = React.lazy(() => import("./views/Pages/Package"));
// const ForgotPass = React.lazy(() => import("./views/Pages/ForgotPass"));
// const Register = React.lazy(() => import("./views/Pages/Register"));

// const Page404 = React.lazy(() => import("./views/Pages/Page404"));
// const Page500 = React.lazy(() => import("./views/Pages/Page500"));

// class App extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       isAuthUser: false,
//       isPaidUser: false,
//     };
//   }


//   componentDidMount() {
//     messaging.requestPermission()
//       .then(async function () {
//         const token = await messaging.getToken();
//         console.log('this is registration token', token);
//         let user = localStorage.getItem('picnic_cityadmin_cred');
//         console.log('this is user', user);
//         user = typeof user === 'string' ? JSON.parse(user) : user;

//         await axios.post(path + 'update_fcm', {
//           fcmToken: token,
//           id: user.data._id
//         })
//       })
//       .catch(function (err) {
//         console.log("Unable to get permission to notify.", err);
//       });
//     navigator.serviceWorker.addEventListener("message", (message) => {
//       console.log('this is message', message);
//       return message
//     });
//     var admincred = localStorage.getItem("picnic_cityadmin_cred");
//     if (localStorage.getItem("picnic_cityadmin_cred")) {
//       console.log("inside if2", admincred);
//       var pro = localStorage.getItem('proFlag');
//       console.log('pro', pro);
//       this.setState(() => ({ isAuthUser: true, isPaidUser: true }));
//     } else {
//       console.log("inside else2");
//       this.setState(() => ({ isAuthUser: false }));
//     }
//   }

//   render() {
//     const { isAuthUser, isPaidUser } = this.state;
//     console.log('isPaidUser', isPaidUser);
//     return (
//       <BrowserRouter>
//         <React.Suspense fallback={loading()}>
//           <Switch>
//             <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
//             <Route exact path="/forgotpass" name="Forgot Password" render={props => <ForgotPass {...props} />} />
//             <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
//             <Route exact path="/package" name="Package Page" render={props => <Package {...props} />} />
//             <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
//             <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
//             <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
//           </Switch>
//         </React.Suspense>
//       </BrowserRouter>
//     );
//   }
// }

// export default App;
// // export default withAuthentication(App);
