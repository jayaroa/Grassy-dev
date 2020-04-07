import React, { Component, lazy, Suspense } from "react";
import { Bar, Line } from "react-chartjs-2";
import swal from 'sweetalert';
import {
  // Badge,
  // Button,
  ButtonDropdown,
  ButtonGroup,
  // ButtonToolbar,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  FormGroup,
  // CardFooter,
  // CardHeader,
  // CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  // Progress,
  Row
  // Table,
} from "reactstrap";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import axios from 'axios';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import cred from "../../cred.json";
var path = cred.API_PATH + "admin/";
var path2 = cred.API_PATH + "cityadmin/";
const Widget03 = lazy(() => import("../../views/Widgets/Widget03"));

const brandPrimary = getStyle("--primary");
const brandSuccess = getStyle("--success");
const brandInfo = getStyle("--info");
const brandWarning = getStyle("--warning");
const brandDanger = getStyle("--danger");

//Card Chart 1


// Card Chart 3
const cardChartData3 = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgba(255,255,255,.2)",
      borderColor: "rgba(255,255,255,.55)",
      data: [78, 81, 80, 45, 34, 12, 40]
    }
  ]
};

const cardChartOpts3 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [
      {
        display: false
      }
    ],
    yAxes: [
      {
        display: false
      }
    ]
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4
    }
  }
};

// Card Chart 4
const cardChartData4 = {
  labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgba(255,255,255,.3)",
      borderColor: "transparent",
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
    }
  ]
};

const cardChartOpts4 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [
      {
        display: false,
        barPercentage: 0.6
      }
    ],
    yAxes: [
      {
        display: false
      }
    ]
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      selectedPark: '',
      allParks: [],
      reviews: [],
      parkLatestReviews: [],
      start_date: new Date(),
      end_date: new Date(),
    };
  }

  onStartChange = start_date => this.setState({ start_date }, async () => {
    await this.getReviews(this.state.selectedPark)
  })
  onEndChange = end_date => this.setState({ end_date }, async () => {
    await this.getReviews(this.state.selectedPark)
  })

  async getAllCityParks(cityAdminCityName) {
    const that = this;
    const serverResponse = await axios
      .post(path2 + "find_park", {
        city_name: cityAdminCityName
      })
    console.log("Response from here : ", serverResponse);
    const res = serverResponse.data;
    if (!res.isError) {
      const allParks = res.details;
      this.setState({ allParks }, () => {
        that.setState({
          selectedPark: JSON.stringify({ parkId: allParks.length ? allParks[0].parkId : '', parkLatestReviews: allParks.length ? allParks[0].parkLatestReviews : [] }),
          parkLatestReviews: allParks.length ? allParks[0].parkLatestReviews : []
        }, async () => {
          if (that.state.selectedPark) {
            const selectedPark = JSON.parse(that.state.selectedPark).parkId
            await that.getReviews(selectedPark)
          }
        })
      });
    }

  }

  async getReviews(park_id) {
    const parkId = this.state.selectedPark ? JSON.parse(this.state.selectedPark).parkId : ''

    const serverResponse = await axios.post(path2 + '/get_park_reviews', {
      park_id: parkId,
      start_date: this.state.start_date,
      end_date: this.state.end_date
    })
    console.log('this is the reviews response', serverResponse);
    this.setState({
      reviews: serverResponse.data.reviews ? serverResponse.data.reviews : []
    })
  }

  handleChange = (e, parkLatestReviews) => {
    const that = this;
    this.setState({
      [e.target.name]: e.target.value,
      parkLatestReviews: JSON.parse(e.target.value).parkLatestReviews
    }, async () => {
      await that.getReviews(this.state.selectedPark)
    })
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  /*compoenent Did mount*/
  async componentDidMount() {
    let cityAdminCity = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityName"];
    await this.getAllCityParks(cityAdminCity);
    let pro = localStorage.getItem('proFlag');
    if (pro == 'undefined' || pro == undefined || pro == null || pro == 'null') {
      alert('Error in getting logged variable');
      this.props.history.push("/login");
    } else {
      if (pro == 0) {

        swal({
          title: "Oops! You dont have access to page",
          text: "You dont have any active plan! Please Upgrade",
          icon: "warning",
          buttons: {
            cancel: "Close",
            Upgrade: true
          },
          dangerMode: true,
        })
          .then(willupgrade => {
            if (willupgrade) {
              swal('', 'You will be redirected to Payment', 'success');
              this.props.history.push("/package");
            } else {
              swal('', 'You will be redirected to Parklist', 'success');
              this.props.history.push("/parklist");
            }
          });
      } else if (pro == 2) {
        this.props.history.push("/package");
      } else {
        console.log(' a pro user');
      }
    }
  }

  render() {
    const reviewsChartCarData = this.state.reviews.length ? this.state.reviews.reduce((acc, value) => {
      acc[new Date(value.createdAt).toLocaleDateString()] = acc[new Date(value.createdAt).toLocaleDateString()] ? acc[new Date(value.createdAt).toLocaleDateString()] + value.cars : value.cars
      return acc
    }, {}) : {};
    const reviewsChartPeopleData = this.state.reviews.length ? this.state.reviews.reduce((acc, value) => {
      acc[new Date(value.createdAt).toLocaleDateString()] = acc[new Date(value.createdAt).toLocaleDateString()] ? acc[new Date(value.createdAt).toLocaleDateString()] + value.people : value.people
      return acc
    }, {}) : {};
    console.log('this is the reviewsChartCarData', reviewsChartCarData)
    // const reviewLabels = this.state.reviews.length ? this.state.reviews.map(item => new Date(item.createdAt).toLocaleDateString()) : []
    const cardChartData1 = {
      labels: Object.keys(reviewsChartCarData),
      datasets: [
        {
          label: "Cars",
          backgroundColor: brandPrimary,
          borderColor: "rgba(255,255,255,.55)",
          data: Object.values(reviewsChartCarData)
        }
      ]
    };

    const cardChartOpts1 = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "transparent",
              zeroLineColor: "transparent"
            },
            ticks: {
              fontSize: 2,
              fontColor: "transparent"
            }
          }
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              display: false,
              min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
              max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5
            }
          }
        ]
      },
      elements: {
        line: {
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4
        }
      }
    };
    const cardChartData2 = {
      labels: Object.keys(reviewsChartPeopleData),
      datasets: [
        {
          label: "people",
          backgroundColor: brandPrimary,
          borderColor: "rgba(255,255,255,.55)",
          data: Object.values(reviewsChartPeopleData)
        }
      ]
    };

    const cardChartOpts2 = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "transparent",
              zeroLineColor: "transparent"
            },
            ticks: {
              fontSize: 2,
              fontColor: "transparent"
            }
          }
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              display: false,
              min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
              max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5
            }
          }
        ]
      },
      elements: {
        line: {
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4
        }
      }
    };
    console.log('this is state', this.state)
    return (
      <div className="animated fadeIn" >
        <Row>
          <Col md="3">
            <Label htmlFor="startDate">Start Date</Label><br />
            <DayPickerInput onDayChange={day => console.log(day)}
              value={this.state.start_date}
              onDayChange={this.onStartChange}
              formatDate={formatDate}
              parseDate={parseDate}
            />
          </Col>
          <Col md="3">
            <Label htmlFor="startDate">End Date</Label><br />
            <DayPickerInput onDayChange={day => console.log(day)}
              value={this.state.end_date}
              onDayChange={this.onEndChange}
              formatDate={formatDate}
              parseDate={parseDate}
            />
          </Col>
          {/* <Col /> */}
          <Col md="3">
            <Form>
              <FormGroup>
                <Label for="parks">Parks</Label>
                <Input value={this.state.selectedPark} type="select" name="selectedPark" id="parks" onChange={this.handleChange}>
                  <option value="">Select Park</option>
                  {
                    this.state.allParks.map((item => {
                      return (
                        <option value={JSON.stringify({ parkId: item.parkId, parkLatestReviews: item.parkLatestReviews })}>{item.parkName}</option>

                      )
                    }))
                  }
                </Input>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.reviews.length ? this.state.reviews.reduce((acc, value) => {
                  acc += value.cars ? value.cars : 0
                  return acc;
                }, 0) : 0}</div>
                <div>Cars</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Line
                  data={cardChartData1}
                  options={cardChartOpts1}
                  height={70}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.reviews.length ? this.state.reviews.reduce((acc, value) => {
                  acc += value.people ? value.people : 0
                  return acc;
                }, 0) : 0}</div>
                <div>People</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Line
                  data={cardChartData2}
                  options={cardChartOpts2}
                  height={100}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-white bg-warning">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.parkLatestReviews ? this.state.parkLatestReviews.length : 0}</div>
                <div>Checkins</div>
              </CardBody>
              <div className="chart-wrapper" style={{ height: "70px" }}>
                <Line
                  data={cardChartData3}
                  options={cardChartOpts3}
                  height={70}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-white bg-danger">
              <CardBody className="pb-0">
                <div className="text-value">XX</div>
                <div>Checkins</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Bar
                  data={cardChartData4}
                  options={cardChartOpts4}
                  height={70}
                />
              </div>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Traffic</CardTitle>
                    <div className="small text-muted">November 2015</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button  color="success" className="float-right"><i className="icon-cloud-download"></i></Button>
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Day</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Month</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>Year</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                  <Line data={mainChart} options={mainChartOpts} height={300} />
                </div>
              </CardBody>
              <CardFooter>
                <Row className="text-center">
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Visits</div>
                    <strong>29.703 Users (40%)</strong>
                    <Progress className="progress-xs mt-2" color="success" value="40" />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Unique</div>
                    <strong>24.093 Users (20%)</strong>
                    <Progress className="progress-xs mt-2" color="info" value="20" />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Pageviews</div>
                    <strong>78.706 Views (60%)</strong>
                    <Progress className="progress-xs mt-2" color="warning" value="60" />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">New Users</div>
                    <strong>22.123 Users (80%)</strong>
                    <Progress className="progress-xs mt-2" color="danger" value="80" />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Bounce Rate</div>
                    <strong>Average Rate (40.15%)</strong>
                    <Progress className="progress-xs mt-2"  color="success" value="40" />
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>         */}
      </div>
    );
  }
}

export default Dashboard;
