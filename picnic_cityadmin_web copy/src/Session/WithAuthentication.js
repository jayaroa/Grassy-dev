import React from "react";
//import { connect } from 'react-redux';
//import { withRouter } from 'react-router-dom';
import AuthUserContext from "./AuthUserContext";
import Login from "../views/Pages/Login/Login";
// import { auth } from '../../utils/firestore';
// import {
//   actions as accountActions
// } from "../../actions/account.actions";
// import { PulseLoader } from 'react-spinners';
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const withAuthentication = Component =>
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        loading: true
      };
    }

    componentDidMount() {
      let userDetails = localStorage.getItem("picnic_cityadmin_cred");

      if (userDetails) {
        console.log("inside if");
        this.setState(() => ({ authUser: JSON.parse(userDetails) }));
        this.setState({ loading: false });
      } else {
        console.log("inside else");
        this.setState(() => ({ authUser: null, loading: false }));
      }
    }

    //   let _rememberMe = cookies.get('_rememberMe');
    //   if(_rememberMe=='false'){
    //     let currentTime = new Date().getTime();
    //     let lastLogin = cookies.get('_signinTime');
    //     let difference = currentTime - lastLogin;
    //     var hoursDifference = Math.floor(difference/1000/60/60);
    //     if(hoursDifference>23){
    //       auth.signOut();
    //     }
    //     else{
    //       auth.onAuthStateChanged(authUser => {
    //         if (authUser) {
    //           this.setState(() => ({ authUser }));
    //           this.setState({ loading: false });
    //           //
    //           // getCurrentUserId() ?this.props.fetchUser(getCurrentUserId()) : '';
    //         } else {
    //           this.setState(() => ({ authUser: null, loading: false }));
    //         }
    //       });
    //     }
    //   }
    //   auth.onAuthStateChanged(authUser => {
    //     if (authUser) {
    //       this.setState(() => ({ authUser }));
    //       this.setState({ loading: false });
    //       //
    //       // getCurrentUserId() ?this.props.fetchUser(getCurrentUserId()) : '';
    //     } else {
    //       this.setState(() => ({ authUser: null, loading: false }));
    //     }
    //   });

    render() {
      const { authUser } = this.state;
      let props = this.props;
      console.log("authUser ======= ", authUser, props);

      return (
        <AuthUserContext.Provider value={authUser}>
          <div>{this.state.authUser ? <Component /> : null}</div>
        </AuthUserContext.Provider>
      );
    }
  };
// const mapDispatchToProps = dispatch => ({
//   fetchUser: data => dispatch(accountActions.fetchUser(data)),
// })
export default withAuthentication;
