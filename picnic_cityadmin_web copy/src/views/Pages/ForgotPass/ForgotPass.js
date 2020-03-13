import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { withToastManager } from 'react-toast-notifications';
import { Alert } from "reactstrap";
import cred from "../../../cred.json";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardFooter,
  Col,
  Container,
  Form,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Select,
  Row
} from "reactstrap";

// var path = 'http://localhost:3132/v1/' + 'user/';
var path = cred.API_PATH;
const textLogoStyle = {
  fontSize: "31px",
  margin: "2px 15px",
  fontWeight: "600"
};
// const { addToast } = useToasts()

class ForgotPass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forgot_email: "",
      reset_email: "",
      password: "",
      otp: "",
      authMessage: ""
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
  }

  // async componentDidMount() {

  // }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleForgotPassword(){
    let that = this;
    let dataToSend = {
      email: this.state.forgot_email,
    };
    axios
      .post(path + "user/forgot_password", dataToSend, {
        headers: { "Content-Type": "application/json" }
      })
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          alert("Please check your email")
          // this.setState({
          //   isAuthenticated: false,
          //   authMessage: "Wrong username or password"
          // });
        } else {
          this.setState({
            isAuthenticated: false,
            authMessage: res.message
          });       
        }
      });
  }

  handleResetPassword() {
    let that = this;
    let dataToSend = {
      email: this.state.reset_email,
      otp: this.state.otp,
      new_password: this.state.password,
    };

    console.log("******************", dataToSend);
    axios
      .post(path + "user/reset_password", dataToSend, {
        headers: { "Content-Type": "application/json" }
      })
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          alert("Password changed successfully")
          this.props.history.push("/login");
        } else {
          alert("Some error occured")
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
                <Card className="p-4 py-5 d-md-down-none">
                  <CardBody>
                    <div>
                      <h2>Forgot Password</h2>
                      {/* <p className="text-muted">Create your account</p> */}

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="forgot_email"
                          placeholder="Enter your email"
                          onChange={(event)=>this.handleChange(event)}
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
                            className="px-4 mb-2"
                            onClick={() => {
                              this.handleForgotPassword();
                            }}
                          >
                            Send OTP
                          </Button>
                        </Col>                   
                      </Row>
                      <Row>
                        <Col xs="8">
                        <Link to="/login">
                          <Button
                             color="success"
                            className="px-4"                            
                          >
                            Go back to Login
                          </Button>
                          </Link>
                        </Col>                   
                      </Row>
                    </div>
                  </CardBody>
                </Card>
                <Card className="py-5 d-md-down-none">
                  <CardBody className="text-center">
                    <h2>Reset Password</h2>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="reset_email"
                        placeholder="Enter your email"
                        onChange={(event)=>this.handleChange(event)}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-key" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="otp"
                        placeholder="Enter your OTP"
                        onChange={event => this.handleChange(event)}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-key" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="password"
                        placeholder="Enter new password"
                        onChange={event => this.handleChange(event)}
                      />
                    </InputGroup>
                    <Row>
                        <Col xs="8">
                          <Button
                             color="success"
                            className="px-4"
                            onClick={() => {
                              this.handleResetPassword();
                            }}
                          >
                            Reset Password
                          </Button>
                        </Col>                   
                      </Row>
                    {/* <div>
                      <p style={textLogoStyle}>Grassy</p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link to="/login">
                        <Button
                           color="success"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Sign-In
                        </Button>
                      </Link>
                    </div> */}
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

export default ForgotPass;
