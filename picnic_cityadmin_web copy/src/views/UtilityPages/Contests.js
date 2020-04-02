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
  InputGroupAddon,
  TabContent, TabPane, Nav, NavItem, NavLink,
} from "reactstrap";
import classnames from 'classnames';
import PictureContests from './PictureContests';
import cred from "../../cred.json";
var path = cred.API_PATH + "admin/";
var path2 = cred.API_PATH + "cityadmin/";

// var path = 'http://localhost:3132/v1/admin/';

// var path = process.env.API_PATH + "admin/";

class Contests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allContests: [],
      value: "",
      city_state: "",
      activeTab: '1'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentDidMount() {
    let cityAdminCity = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityName"];
    this.setState({ city_name: cityAdminCity });
    this.getAllContests(cityAdminCity);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.searchCityParks(event.target.value);
  }

  handleChangeTab = (tab) => {
    this.setState({
      activeTab: tab
    })
  }

  getAllContests(cityAdminCityName) {
    axios
      .post(path2 + "find_contests", {
        city_state: cityAdminCityName
      })
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          const allContests = res.details;
          var count = 0;
          var newList = [];

          for (let i = 0; i < allContests.length; i++) {
            if (allContests[i].isEnabled == true) {
              count++;
            }
          }

          for (let i = 0; i < allContests.length; i++) {
            if (allContests[i].contestType == "CHECKIN") {
              newList.push(allContests[i]);
            }
          }

          this.setState({
            active_count: count,
            allContests: newList
          });
        }
      });
  }

  removeContest(contestId) {
    axios
      .post(path2 + "remove_contest", { contest_id: contestId })
      .then(serverResponse => {
        const res = serverResponse.data;
        console.log(res);
        if (res.isError) {
          alert("Some error occured");
        } else {
          //alert("Deleted Successfully");
          this.getAllContests(this.state.city_name);
        }
      });
  }

  editContest(contestId) {
    this.props.history.push(`/contests/contestdetails/${contestId}`);
  }

  render() {
    const { activeTab } = this.state
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
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { this.handleChangeTab('1'); }}
            >
              Check-in Contests
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { this.handleChangeTab('2'); }}
            >
              Picture Contests
          </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <div className="animated fadeIn">
              <Row>
                <Col>
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify" />Contest List
                <Link to="/contests/contestdetails/new/">
                        <button className="btn btn-success btn-sm mr-2 float-right">
                          Add Contest <i className="fa fa-edit" />
                        </button>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      {/* <Suspense  fallback={this.loading()}></Suspense> */}

                      <Row>
                        {this.state.allContests.map(eachDetails => (
                          <Col md="4" key={eachDetails.contestId}>
                            <Card>
                              <CardBody style={noPadding}>
                                <img
                                  src={eachDetails.sponsorLogo}
                                  className="pavImgThumb"
                                />
                              </CardBody>
                              <CardFooter>
                                <Row>
                                  <Col md="8">Sponsor name: {eachDetails.sponsorName}</Col>
                                  <Col md="4" style={availableOptions}>
                                    <span>
                                      <i
                                        className="fa fa-trash"
                                        style={deleteIconStyle}
                                        onClick={() =>
                                          this.removeContest(eachDetails.contestId)
                                        }
                                      />
                                      <i
                                        className="fa fa-edit"
                                        style={editIconStyle}
                                        onClick={() =>
                                          this.editContest(eachDetails.contestId)
                                        }
                                      />
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md="6">Award amount: ${eachDetails.awardAmount}</Col>
                                </Row>
                                <Row>
                                  <Col md="8">Dates: {new Date(eachDetails.startDate).toLocaleDateString("en-US", { year: '2-digit', month: 'numeric', day: 'numeric' })} - {new Date(eachDetails.endDate).toLocaleDateString("en-US", { year: '2-digit', month: 'numeric', day: 'numeric' })}</Col>
                                </Row>
                                <Row>
                                  <Col md="8">Contest status: {eachDetails.isEnabled == true ? "Active" : "Inactive"}</Col>
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
          </TabPane>
          <TabPane tabId="2">
            <PictureContests {...this.props} />
          </TabPane>
        </TabContent>

      </div>
    );
  }
}

export default Contests;
