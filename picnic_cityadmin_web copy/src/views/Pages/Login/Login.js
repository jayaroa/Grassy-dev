import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { withToastManager } from 'react-toast-notifications';
import { Alert } from "reactstrap";
import cred from "../../../cred.json";
// import { messaging } from '../../../init-fcm'
import logo from '../../../assets/img/brand/grassy_logo.png';
import { NotificationManager } from 'react-notifications'

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

// var path = 'http://localhost:3132/v1/' + 'user/';
var path = cred.API_PATH + "user/";

const textLogoStyle = {
  fontSize: "31px",
  margin: "2px 15px",
  fontWeight: "600"
};
// const { addToast } = useToasts()

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isAuthenticated: true,
      authMessage: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  calculatedate(profilecreatedate) {
    console.log('this is profilecreateddate', profilecreatedate);
    const previous_date = new Date(profilecreatedate);
    console.log('prevous_date', previous_date);
    // var prev_date_format = previous_date.getFullYear() + '-' + ((previous_date.getMonth() + 1) > 9 ? (previous_date.getMonth() + 1) : '0' + (previous_date.getMonth() + 1)) + '-' + (previous_date.getDate() > 9 ? previous_date.getDate() : '0' + previous_date.getDate());
    let prev_date_format = previous_date.getFullYear() + '-' + (previous_date.getMonth() + 1) + '-' + previous_date.getDate();
    console.log('prev_date_format', prev_date_format)
    let currentdate = (new Date()).toISOString().split('T')[0];
    console.log('currentdate', currentdate)
    const cur = new Date(currentdate);
    const prev = new Date(prev_date_format)
    const diffTime = Math.abs(cur - prev);
    console.log('diffTime', diffTime, cur, prev)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('this is the dirrDays in calcuated date', diffDays)
    return diffDays;
    // var prev_date_format = previous_date.getFullYear() + '-' + ((previous_date.getMonth() + 1) > 9 ? (previous_date.getMonth() + 1) : '0' + (previous_date.getMonth() + 1)) + '-' + (previous_date.getDate() > 9 ? previous_date.getDate() : '0' + previous_date.getDate());
    // let previous_date = (new Date(profilecreatedate)).toISOString().split('T')[0];

  }

  async componentDidMount() {
    let storage = await localStorage.getItem("picnic_cityadmin_cred");
    if (storage) {
      let that = this;
      var responseResult = JSON.parse(storage);
      /*code by sheeza*/
      if (responseResult.data != '') {
        var proFlag = responseResult.data.proFlag;
        /*conditional check for free trial days*/
        var profilecreatedate = responseResult.data.profileCreatedAt;
        var diffDays = that.calculatedate(profilecreatedate);

        if (diffDays != '') {
          if (proFlag == 0) {
            // if (true) {
            if (typeof diffDays === "number" || (diffDays < cred.FREETRIAL)) {
              localStorage.setItem("proFlag", proFlag);
              that.props.history.push("/package");
            } else {
              alert('Your Free trial is exceeded');
              localStorage.setItem("proFlag", 2);
              that.props.history.push("/package");
            }
          } else {
            localStorage.setItem("proFlag", proFlag);
            that.props.history.push("/dashboard");
          }
        } else {
          this.setState({
            isAuthenticated: false,
            authMessage: "Error in getting the date Please try after some time"
          });
        }
      }
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }



  handleSubmit() {
    let that = this;
    let dataToSend = {
      email: this.state.username,
      password: this.state.password
    };
    axios
      .post(path + "sign_in", dataToSend, {
        headers: { "Content-Type": "application/json" }
      })
      .then(serverResponse => {
        const res = serverResponse.data;
        if (!res.isError) {
          localStorage.setItem("picnic_cityadmin_cred", JSON.stringify(res['details']));
          // let user = localStorage.getItem('picnic_cityadmin_cred');
          // console.log('this is user', user);
          // user = typeof user === 'string' ? JSON.parse(user) : user;
          // messaging.requestPermission()
          //   .then(async function () {
          //     const token = await messaging.getToken();
          //     console.log('this is registration token', token);
          //     const adminPath = cred.API_PATH + '/admin/'
          //     await axios.post(adminPath + 'update_fcm', {
          //       fcmToken: token,
          //       id: user.data._id
          //     })
          //     messaging.onTokenRefresh(async () => {
          //       messaging.getToken().then(async (refreshedToken) => {
          //         console.log('Token refreshed.');
          //         // Indicate that the new Instance ID token has not yet been sent to the
          //         // app server.


          //         await axios.post(adminPath + 'update_fcm', {
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
          /*code by sheeza*/
          var responseResult = res['details'];
          if (responseResult.data != '') {
            console.log('this is responseresule.data.result', responseResult.data)
            var proFlag = responseResult.data.proFlag;
            /*conditional check for free trial days*/
            var profilecreatedate = responseResult.data.profileCreatedAt;
            var diffDays = this.calculatedate(profilecreatedate);
            if (diffDays != '') {
              if (proFlag == 0) {
                // if (true) {
                if (typeof diffDays === "number" || diffDays < cred.FREETRIAL) {
                  localStorage.setItem("proFlag", proFlag);
                  that.props.history.push("/package");
                } else {
                  alert('Your Free trial is exceeded');
                  localStorage.setItem("proFlag", 2);
                  that.props.history.push("/package");
                }
              } else {
                localStorage.setItem("proFlag", proFlag);
                that.props.history.push("/dashboard");
              }
            } else {
              this.setState({
                isAuthenticated: false,
                authMessage: "Error in getting the date Please try after some time"
              });
            }
          } else {
            this.setState({
              isAuthenticated: false,
              authMessage: "Error in authenticating user Please try after some time"
            });
          }
          /*code by sheeza end*/
        } else {
          this.setState({
            isAuthenticated: false,
            authMessage: "Wrong username or password"
          });
        }
      });
  }

  render() {
    const errMsg = {
      color: "RED"
    };

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <div>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="username"
                          placeholder="Enter your email"
                          onChange={this.handleChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          onChange={this.handleChange}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="4" />
                        <Col xs="8">
                          {this.state.isAuthenticated == false ? (
                            <p style={errMsg}>{this.state.authMessage}</p>
                          ) : null}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="success"
                            className="px-4"
                            onClick={() => {
                              this.handleSubmit();
                            }}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            <Link to="/forgotpass">Forgot password?</Link>
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <Link to="/register">
                            <Button
                              color="success"
                              className="mt-3"
                              active
                              tabIndex={-1}
                            >
                              Register Now
                        </Button>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
                <Card
                  className="text-white  py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div style={{ "marginTop": '45px' }}>
                      <img src={logo} width="300px" />

                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          {/* {this.state.isAuthenticated == false?
                    <Row>
                       <Col md="5"></Col>
                      <Col md="4">
                        <Alert color="danger">
                          {this.state.authMessage}
                        </Alert>
                      </Col>
                    </Row>
                         : null
                        }         */}
        </Container>
      </div>
    );
  }
}

export default Login;
