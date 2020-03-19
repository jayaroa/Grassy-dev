import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import cred from "../../../cred.json";
import logo from '../../../assets/img/brand/grassy_logo.png'


import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardFooter,
  CardTitle,
  Col,
  Container,
  Form,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  // Select,
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

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      mobile: "",
      password: "",
      cityName: "",
      cityId: "",
      user_type: "CITY-MANAGER",
      cityList: [],
      authMessage: "",
      selectedOption: null,
      inputValue: ""
    };

    this.showPackage = this.showPackage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  filterCities = inputValue => {
    let listOfCities = this.state.cityList;
    return listOfCities.filter(i =>
      i.label.toUpperCase().includes(inputValue.toUpperCase())
    );
  };

  loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      return callback(this.filterCities(inputValue));
    }, 2000);
  };

  handleChange = newValue => {
    if (newValue.length == 3) {
      this.getCityList(newValue);
    }
    const inputValue = newValue.replace(/\W/g, "");
    this.setState({ inputValue });
    return inputValue;
  };

  getCityList(searchTerm) {

    axios
      .post(path + "admin/get_city_list/", { search_term: searchTerm })
      .then(serverResponse => {
        const res = serverResponse.data;
        if (!res.isError) {
          let listOfCities = res.details.map(city => {
            return { value: city.cityId, label: city.cityDisplayName };
          });
          this.setState({
            cityList: listOfCities
          });
        } else {
          // this.setState({
          //   isAuthenticated: false,
          //   authMessage: "Wrong username or password"
          // });
        }
      });
  }

  onSearchOptionSelect(val) {
    this.setState({
      cityId: val.value,
      cityName: val.label
    });
  }

  onSelectChange(event) {
    const searchValue = event.target.value;
    if (searchValue.length > 3) {
      this.getCityList(searchValue);
    }
  }

  handleChangeInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  /*Show packages and save user details*/
  showPackage(e) {
    e.preventDefault();

    let that = this;
    if (
      that.state.name == "" ||
      that.state.email == "" ||
      that.state.password == "" ||
      that.state.mobile == "" ||
      that.state.cityId == ""
    ) {
      alert("Please fill all the details");
    } else {
      let dataToSend = {
        name: that.state.name,
        email: that.state.email,
        mobile: that.state.mobile,
        password: that.state.password,
        city_name: that.state.cityName.toUpperCase(),
        city_id: that.state.cityId,
        user_type: that.state.user_type
      };

      axios
        .post(path + "/user/sign_up", dataToSend, {
          headers: { "Content-Type": "application/json" }
        })
        .then(serverResponse => {
          console.log("Response from here sdfvgdsfgsdfg: ", serverResponse);
          const res = serverResponse.data;
          if (!res.isError) {
            alert("User Registered successfully");
            that.props.history.push("/login");
          } else {
            that.setState({
              isAuthenticated: false,
              authMessage: res.details
            });
          }
        });
    }
  }


  getCityList(searchTerm) {

    axios
      .post(path + "admin/get_city_list/", { search_term: searchTerm })
      .then(serverResponse => {
        const res = serverResponse.data;
        if (!res.isError) {
          let listOfCities = res.details.map(city => {
            return { value: city.cityId, label: city.cityDisplayName };
          });
          this.setState({
            cityList: listOfCities
          });
        } else {
          // this.setState({
          //   isAuthenticated: false,
          //   authMessage: "Wrong username or password"
          // });
        }
      });
  }

  onSearchOptionSelect(val) {
    this.setState({
      cityId: val.value,
      cityName: val.label
    });
  }

  onSelectChange(event) {
    const searchValue = event.target.value;
    if (searchValue.length > 3) {
      this.getCityList(searchValue);
    }
  }


  handleChangeInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
    let that = this;
    if (
      that.state.name == "" ||
      that.state.email == "" ||
      that.state.password == "" ||
      that.state.mobile == "" ||
      that.state.cityId == ""
    ) {
      alert("Please fill all the details");
    } else {
      let dataToSend = {
        name: that.state.name,
        email: that.state.email,
        mobile: that.state.mobile,
        password: that.state.password,
        city_name: that.state.cityName.toUpperCase(),
        city_id: that.state.cityId,
        user_type: that.state.user_type
      };

      axios
        .post(path + "/user/sign_up", dataToSend, {
          headers: { "Content-Type": "application/json" }
        })
        .then(serverResponse => {
          console.log("Response from here sdfvgdsfgsdfg: ", serverResponse);
          const res = serverResponse.data;
          if (!res.isError) {
            alert("Signed up successfully");
            that.props.history.push("/login");
          } else {
            that.setState({
              isAuthenticated: false,
              authMessage: res.details
            });
          }
        });
    }
  }

  render() {
    const errMsg = {
      color: "RED",
      fontFamily: "Monospace"
    };

    let { selectedOption } = this.state.cityList;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="12">
              <CardGroup className="step01">
                <Card className="p-4">
                  <CardBody>
                    <div>
                      <h1>Sign Up</h1>
                      <p className="text-muted">Create your account</p>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          onChange={event => this.handleChangeInput(event)}
                        />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-envelope" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="email"
                          placeholder="Enter your email"
                          onChange={event => this.handleChangeInput(event)}
                        />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-key" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          onChange={event => this.handleChangeInput(event)}
                        />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-phone" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="mobile"
                          placeholder="Enter your office phone"
                          onChange={event => this.handleChangeInput(event)}
                        />
                      </InputGroup>

                      <Label>Enter your city's name</Label>
                      <InputGroup className="mb-4">
                        <Col md-12 className="p-0">
                          <AsyncSelect
                            cacheOptions
                            loadOptions={this.loadOptions}
                            defaultOptions
                            onInputChange={this.handleChange}
                            onChange={val => this.onSearchOptionSelect(val)}
                          />
                        </Col>
                      </InputGroup>
                      <Row>
                        <Col xs="3" />
                        <Col xs="9">
                          {this.state.isAuthenticated == false ? (
                            <p style={errMsg}>{this.state.authMessage}</p>
                          ) : null}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                        <Button
                        onClick={this.showPackage}
                          color="success"
                          className="px-4"
                        >
                          Register
                        </Button>
                        </Col>
                      </Row>
                      <Row>
                          <Col xs="12" >
                            <Link to="/login">
                              <Button
                                color="success"
                                className="mt-3"
                                active
                                tabIndex={-1}
                              >
                                Already have an acount? Sign-In
                              </Button>
                            </Link>
                          </Col>
                        </Row>
                    </div>
                  </CardBody>
                </Card>
                <Card
                  className="text-white py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div style={{paddingTop : '130px'}}>
                    <img src={logo} width="300px" />
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
