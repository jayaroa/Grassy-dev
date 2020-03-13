import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { withToastManager } from 'react-toast-notifications';
import { Alert } from "reactstrap";
import cred from "../../../cred.json";
import logo from '../../../assets/img/brand/grassy_logo.png'

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

  async componentDidMount() {
    let storage = await localStorage.getItem("picnic_cityadmin_cred");
    if (storage) {
      this.props.history.push("/");
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
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          localStorage.setItem("picnic_cityadmin_cred", JSON.stringify(res['details']));
          that.props.history.push("/dashboard");
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
                    <div style={{"marginTop":'45px'}}>
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
