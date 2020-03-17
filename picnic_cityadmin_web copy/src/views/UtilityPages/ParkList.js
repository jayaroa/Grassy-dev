import React, { Component, Suspense } from "react";
import { Link } from "react-router-dom";
import { AppSwitch } from "@coreui/react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import cred from "../../cred.json";
var path = cred.API_PATH + "admin/";
var path2 = cred.API_PATH + "cityadmin/";

// var path = 'http://localhost:3132/v1/admin/';

// var path = process.env.API_PATH + "admin/";

class ParkList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allParks: [],
      value: "",
      city_name: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentDidMount() {
    let cityAdminCity = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityName"];
    this.setState({ city_name: cityAdminCity });
    this.getAllCityParks(cityAdminCity);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.searchCityParks(event.target.value);
  }

  getAllCityParks(cityAdminCityName) {
    axios
      .post(path2 + "find_park", {
        city_name: cityAdminCityName
      })
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          const allParks = res.details;
          this.setState({ allParks });
        }
      });
  }

  searchCityParks(searchKey) {
    console.log("Hi");
    axios
      .post(path2 + "find_park", {
        search_term: searchKey,
        city_name: this.state.city_name
      })
      .then(serverResponse => {
        // console.log("Response from here : ",serverResponse)
        const res = serverResponse.data;
        if (!res.isError) {
          const allParks = res.details;
          this.setState({ allParks });
        }
      });
  }

  toggleSwitchHandler(parkId) {
    axios
      .post(path + "approve_park", { park_id: parkId })
      .then(serverResponse => {
        const res = serverResponse.data;
        console.log(res);
        if (res.isError) {
          alert("Some error occured");
        }
      });
  }

  removePark(parkId) {
    axios
      .post(path2 + "remove_park", { park_id: parkId })
      .then(serverResponse => {
        const res = serverResponse.data;
        console.log(res);
        if (res.isError) {
          alert("Some error occured");
        } else {
          alert("Deleted Successfully");
          this.getAllCityParks(this.state.city_name);
        }
      });
  }

  editPark(parkId) {
    this.props.history.push(`/parklist/parkdetails/${parkId}`);
  }

  render() {
    // let pavImgThumb = {
    //   width: '100%',
    //   height: '150px',
    //   objectFit: 'cover'
    // };

    let noPadding = {
      padding: "0px"
    };

    let editIconStyle = {
      float: "right",
      cursor: "pointer"
    };

    let deleteIconStyle = {
      float: "right",
      cursor: "pointer",
      marginLeft: "8px"
    };

    let availableOptions = {
      padding: "0px 8px"
    };

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Park List
                <Link to="/parklist/parkdetails/new">
                  <button className="btn btn-success btn-sm mr-2 float-right">
                    Add Park <i className="fa fa-edit" />
                  </button>
                </Link>
              </CardHeader>
              <CardBody>
                {/* <Suspense  fallback={this.loading()}></Suspense> */}

                <FormGroup row>
                  <Col md="12">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <Button type="button" color="secondary">
                          <i className="fa fa-search" /> Search
                        </Button>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="input1-group2"
                        name="input1-group2"
                        placeholder="Search Park by name or zipcode"
                        value={this.state.value}
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                  </Col>
                </FormGroup>

                <Row>
                  {this.state.allParks.map(eachDetails => (
                    <Col md="4" key={eachDetails.parkId}>
                      <Card>
                        <CardBody style={noPadding}>
                          <img
                            src={eachDetails.parkDefaultPic}
                            className="pavImgThumb"
                          />
                        </CardBody>
                        <CardFooter>
                          <Row>
                            <Col md="8"> {eachDetails.parkName}</Col>
                            <Col md="4" style={availableOptions}>
                              <span>
                                <i
                                  className="fa fa-trash"
                                  style={deleteIconStyle}
                                  onClick={() =>
                                    this.removePark(eachDetails.parkId)
                                  }
                                />
                                <i
                                  className="fa fa-edit"
                                  style={editIconStyle}
                                  onClick={() =>
                                    this.editPark(eachDetails.parkId)
                                  }
                                />
                              </span>
                            </Col>
                          </Row>
                        </CardFooter>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ParkList;
