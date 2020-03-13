import React, { Component } from "react";
import { AppSwitch } from "@coreui/react";
import axios from "axios";
import { Link } from "react-router-dom";
import GoogleApiWrapper from "../Widgets/mapwidget";
import DatePicker from 'react-date-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';

import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";
import GoogleMapReact from "google-map-react";
import MapMarker from "../../assets/favicon.ico";

import {
  // Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  // Collapse,
  // DropdownItem,
  // DropdownMenu,
  // DropdownToggle,
  // Fade,
  // Form,
  FormGroup,
  // FormText,
  // FormFeedback,
  Input,
  // InputGroup,
  // InputGroupAddon,
  // InputGroupButtonDropdown,
  // InputGroupText,
  Label,
  Row
} from "reactstrap";
import cred from "../../cred.json";
var path = cred.API_PATH;

const bucket = new S3({
  accessKeyId: "AKIAI3Q34TYEXRXCY6XA",
  secretAccessKey: "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",
  region: "eu-west-1"
});

class AddEditComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contest_mode: "ADD", 
      sponsor_name: "",
      award_amount: "",
      start_date: new Date(),
      end_date: new Date(),
      is_enabled: false,
      sponsor_logo: "",
      mystery_picture: "",
      contest_type: "",
      contest_pictures: [],
      contest_details: "",
      support_email: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  onStartChange = start_date => this.setState({ start_date })
  onEndChange = end_date => this.setState({ end_date })

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  getContestDetails() {
    let dataToSend = {
      contest_id: this.props.match.params.id
    };
    axios
      .post(path + "cityadmin/find_contest", dataToSend, {
        headers: { "Content-Type": "application/json" }
      })
      .then(serverResponse => {
        const res = serverResponse.data;
        if (!res.isError) {
            console.log("************************");
            this.setState({
              park_mode: "EDIT", 
              sponsor_name: res["details"][0]["sponsorName"],
              award_amount: res["details"][0]["awardAmount"],
              start_date: res["details"][0]["startDate"],
              end_date: res["details"][0]["endDate"],
              is_enabled: res["details"][0]["isEnabled"],
              sponsor_logo: res["details"][0]["sponsorLogo"],
              mystery_picture: res["details"][0]["mysteryPicture"],
              contest_type: res["details"][0]["contestType"],
              contest_details: res["details"][0]["contestDetails"],
              support_email: res["details"][0]["supportEmail"]
            });
            
            let contestPicArr = [];
            contestPicArr.push(this.state.sponsor_logo);
            this.setState({ contest_pictures: contestPicArr });
        }
      });
  }

  ////////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    let cityAdminCity = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityName"];
    let cityAdminCityId = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityId"];
    let cityAdminId = JSON.parse(localStorage.getItem("picnic_cityadmin_cred"))[
      "data"
    ]["userId"];
    this.setState({
      park_city: cityAdminCity,
      park_cityId: cityAdminCityId,
      last_updated_by: cityAdminId
    });

    if (this.props.match.params.id != "new") {
      this.getContestDetails();
      this.setState({
        contest_mode: "EDIT",
        contest_id: this.props.match.params.id
      });
    }
  }

  handleSubmit() {
    this.addEditContest(this.state.contest_mode);
  }

  addEditContest(action_type) {
    // let dataToSend = { ...this.state };
      
    let that = this;
    let dataToSend = {
      sponsor_name: that.state.sponsor_name,
      award_amount: that.state.award_amount,
      start_date: that.state.start_date,
      end_date: that.state.end_date,
      is_enabled: that.state.is_enabled,
      sponsor_logo: that.state.sponsor_logo,
      park_city: that.state.park_city,
      contest_id: that.state.contest_id,
      mystery_picture: "no_pic",
      contest_type: "CHECKIN",
      contest_details: that.state.contest_details,
      support_email: that.state.support_email
    };

    dataToSend.operation_type = action_type;
    console.log(dataToSend);
    axios
      .post(path + "cityadmin/add_edit_contest", dataToSend)
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          // console.log("success");
//          if (action_type == "ADD") {
//            alert("Park added successfully");
//          } else {
//            alert("Park updated successfully");
//          }
          this.props.history.push("/contests");
          // history.push('/parklist')
        } else {
          alert(res.message);
        }
      });
  }

  ///////////////////////////////////////////////////////////////////////// Image Upload section

  saveImagePath = event => {
    // this.inputElement.click();
    if (event) {
      this._uploadImage(event, "contest").then(result => {
        let park_image = result.toString();
        let that = this;
        let contestPicArr = [];
        contestPicArr.push(park_image);
        this.setState({ sponsor_logo : park_image });
        this.setState({ contest_pictures: contestPicArr });
      });
    }
  };

  _uploadImage(e, folder_name) {
    // console.log("sdjfgdufk");
    var awsPath = new Promise((resolve, reject) => {
      let file = e.target.files[0];
      let myPromise;
      var filename =
        folder_name +
        "/" +
        Date.now() +
        "_" +
        file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();

      this.params = {
        Bucket: "picnic-s3",
        Key: filename,
        Body: file,
        ACL: "public-read"
      };
      bucket.upload(this.params, function(err, data) {
        resolve(data.Location);
      });
    });
    return awsPath;
  }

  //////////////////////////////////////////////////////////////////////////

  render() {
    let { park_amenities } = this.state;

    let addBtn = {
      textAlign: "center",
      padding: "30px 0px",
      /* font-size: 18px; */
      cursor: "pointer",
      boxShadow: "1px 1px 7px 0px #d6d1d1"
    };

    let borderV = {
      borderLeft: "2px solid #6b6b6b"
    };

    let borderTop = {
      borderTop: "2px solid #6b6b6b",
      marginTop: "10px",
      paddingTop: "10px"
    };

    let mb20 = {
      marginBottom: "20px"
    };

    let mb5 = {
      marginBottom: "5px"
    };

    let editIconStyle = {
      float: "right",
      cursor: "pointer"
    };

    let deleteIconStyle = {
      float: "left",
      cursor: "pointer"
    };

    let availableOptions = {
      padding: "0px 8px"
    };

    let pavThumb = {
      padding: "0px"
    };

    let pavImgThumb = {
      width: "185px",
      height: "150px"
    };

    let fileInputStyle = {
      height: "100%",
      position: "absolute",
      top: "0",
      opacity: "0",
      zIndex: "1",
      cursor: "pointer"
    };

    let noPadding = {
      padding: "0px"
    };

    let uploadBtnWrapper = {
      position: "relative",
      overflow: "hidden",
      display: "inline-block"
    };

    let flexDisplay = {
      display: "flex"
    };

    let flexDisplay2 = {
      flex: "1"
    };

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Contest Details</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="10">
                    {/* Park basic details */}
                    <Row style={mb20}>
                      <Col md="12">
                        <FormGroup>
                          <Row style={mb20}>
                            <Col md="3">
                              <Label htmlFor="mobile">Sponsor Name</Label>
                              <Input
                                type="text"
                                name="sponsor_name"
                                value={
                                  this.state.sponsor_name
                                    ? this.state.sponsor_name
                                    : ""
                                }
                                placeholder="Enter sponsor name"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="address">Award Amount</Label>
                              <Input
                                type="text"
                                name="award_amount"
                                value={this.state.award_amount}
                                placeholder="Enter award amount (ex: $10)"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="startDate">Contest Start Date</Label><br/>
                                <DayPickerInput onDayChange={day => console.log(day)}
                                    value={this.state.start_date}
                                    onDayChange={this.onStartChange}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="startDate">Contest End Date</Label><br/>
                                <DayPickerInput onDayChange={day => console.log(day)}
                                    value={this.state.end_date}
                                    onDayChange={this.onEndChange}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                />
                            </Col>
                            <Col md="3">
                                <br/><Label htmlFor="address">Support Email</Label>
                              <Input
                                type="text"
                                name="support_email"
                                value={this.state.support_email}
                                placeholder="Enter contest contact email"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                            <Col md="3">
                                <br/><Label>Is Contest Enabled</Label><br/>
                                <AppSwitch className={"mx-1"} variant={"pill"} color={"success"} 
                                onChange={event => this.handleChange(event)}
                                name="is_enabled"
                                checked={this.state.is_enabled}
                            // onClick={() =>
                            //   this.toggleSwitchHandler(eachDetails.parkId)
                            // }
                          />
                            </Col>
                            
                          </Row>
                            <Row style={mb20}>
                                    <Col md="10">
                                <Label>Contest Details</Label><br/>
                                <textarea
                                type="text"
                                name="contest_details"
                                value={this.state.contest_details}
                                placeholder="Enter contest details"
                                onChange={event => this.handleChange(event)}
                                style ={{width: '100%'}}
                                rows={8}
                              />
                            </Col>
                    </Row>
                            {/* Park pictures */}
                    <Label htmlFor="sponsorLogo">Sponsor Logo</Label><br/>
                    <Row>
                      {this.state.contest_pictures.map(pic => {
                        return (
                          <Col md="3">
                            <Card>
                              <CardBody style={noPadding}>
                                <img src={pic} className="pavImgThumb" />
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}

                      <Col md="2">
                        <Card style={addBtn}>
                          <Input
                            type="file"
                            style={fileInputStyle}
                            onChange={this.saveImagePath}
                          />
                          <CardBody>
                            <div
                              style={uploadBtnWrapper}
                              onClick={this.clickImageInput}
                            >
                              <i className="fa fa-plus fa-3x" />
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      <Col md="2">
                        <div />
                      </Col>
                    </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                                  
                    
                  </Col>
                </Row>
                <Row className="justify-content-end" style={borderTop}>
                  <Button
                    className="btn btn-success submitStyle"
                    onClick={() => this.handleSubmit()}
                  >
                    SAVE
                  </Button>
                  <Link to="/contests">
                    <Button className="btn btn-default submitStyle mx-3">
                      CANCEL
                    </Button>
                  </Link>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddEditComponent;
