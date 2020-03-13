import React, { Component } from "react";
import { AppSwitch } from "@coreui/react";
import axios from "axios";
import { Link } from "react-router-dom";
import GoogleApiWrapper from "../Widgets/mapwidget";

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
      parkMode: "ADD",

      park_name: "",
      park_email: "",
      park_mobile: "",
      park_address: "",
      park_city: "",
      // park_cityState : "",
      park_cityId: "",
      park_zip_code: "",
      park_lat: "37.781555",
      park_long: "-122.393990",
      park_acre: "",
      park_default_picture: "",
      park_pictures: [],
      park_amenities: [],
      park_details: [],
      park_verified: false,
      park_message: "",    
      last_updated_by: "",

      pavilionModal: false,
      pavilionModalMode: "ADD",

      mapModal: false,

      park_pavilions: [],
      pavilion_id: 0,
      pavilion_name: "",
      pavilion_reservation_url: "",
      pavilion_lat: "",
      pavilion_long: "",
      pavilion_pictures: [],
      pavilion_isReservable: true,
      pavilion_details: []
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openPavilionModal = this.openPavilionModal.bind(this);
    this.openMapModal = this.openMapModal.bind(this);
    this.addEditPavilion = this.addEditPavilion.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  getParkDetails() {
    let dataToSend = {
      park_id: this.props.match.params.id
    };
    axios
      .post(path + "admin/find_park_details", dataToSend, {
        headers: { "Content-Type": "application/json" }
      })
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          console.log(res);
          if (
            res["details"]["parkAmenities"].length == 0 ||
            res["details"]["parkDetails"].length == 0
          ) {
            console.log("************************");
            this.setState({
              park_name: res["details"]["parkName"],
              park_email: res["details"]["parkEmail"],
              park_mobile: res["details"]["parkMobile"],
              park_address: res["details"]["parkAddress"],
              park_city: res["details"]["parkCity"],
              park_zip_code: res["details"]["parkZipCode"],
              park_acre: res["details"]["parkAcreage"],
              park_long: res["details"]["parkCoordinate"]["coordinates"][0],
              park_lat: res["details"]["parkCoordinate"]["coordinates"][1],              
              // park_amenities: res["details"]["parkAmenities"],
              // park_details: res["details"]["parkDetails"],
              park_default_picture: res["details"]["parkDefaultPic"],
              park_pictures: res["details"]["parkPictures"],
              park_pavilions: res["details"]["pavilions"],
              park_verified: res["details"]["isParkVerified"],
              park_message: res["details"]["parkMessage"],
              pavilionModalMode: "EDIT"
            });
          } else {
            this.setState({
              park_name: res["details"]["parkName"],
              park_email: res["details"]["parkEmail"],
              park_mobile: res["details"]["parkMobile"],
              park_address: res["details"]["parkAddress"],
              park_city: res["details"]["parkCity"],
              park_zip_code: res["details"]["parkZipCode"],
              park_acre: res["details"]["parkAcreage"],
              park_long: res["details"]["parkCoordinate"]["coordinates"][0],
              park_lat: res["details"]["parkCoordinate"]["coordinates"][1],              
              park_amenities: res["details"]["parkAmenities"],
              park_details: res["details"]["parkDetails"],
              park_default_picture: res["details"]["parkDefaultPic"],
              park_pictures: res["details"]["parkPictures"],
              park_pavilions: res["details"]["pavilions"],
              park_verified: res["details"]["isParkVerified"],
              park_message: res["details"]["parkMessage"],
              pavilionModalMode: "EDIT"
            });
          }
          // alert('Success');
          // history.push('/parklist')
        }
      });
  }

  updateLoc(data) {
    let that = this;
    console.log("updating loc from child", data);
    that.setState({
      park_lat: data.lat,
      park_long: data.lng
    });
  }

  onClosed() {
    this.setState({
      pavilionModal: !this.state.pavilionModal,
      // pavilion_id: 0,
      pavilion_name: "",
      pavilion_reservation_url: "",
      pavilion_lat: "",
      pavilion_long: "",
      pavilion_isReservable: "",
      pavilion_pictures: []
    });
  }

  openMapModal() {
    this.setState({
      mapModal: !this.state.mapModal
    });
  }

  // Handler to open add/edit pavilion modal
  openPavilionModal(mode) {
    this.setState({
      pavilionModal: !this.state.pavilionModal
    });
    if (mode === "ADD") {
      this.getAllPavilionDetailsList();
      this.setState({
        pavilionModalMode: "ADD",
        pavilion_name: "",
        pavilion_reservation_url: "",
        pavilion_lat: "",
        pavilion_long: "",
        pavilion_isReservable: "",
        pavilion_pictures: []
      });
    }
  }

  //////////////////////////////////////////////////////////////////////// >> Details

  toggleDetailsHandler(index) {
    let that = this;
    let parkDetails = that.state.park_details;
    parkDetails[index]["detailsValue"] = "";
    parkDetails[index]["isChecked"] = !parkDetails[index]["isChecked"];
    that.setState({ park_details: parkDetails });
  }

  detailsValueHandler(index, value) {
    let that = this;
    let parkDetails = that.state.park_details;
    parkDetails[index]["detailsValue"] = value;
    that.setState({ park_details: parkDetails });
    // console.log(parkDetails);
  }

  getAllDetailsList() {
    let that = this;
    axios.post(path + "admin/get_details_list").then(serverResponse => {
      console.log("Park list here : ", serverResponse);
      const res = serverResponse.data;
      if (!res.isError) {
        res.details.map(n => {
          n["isChecked"] = false;
          n["gdetailsValue"] = "";
          return n;
        });
        that.setState({ park_details: res.details });
        console.log("hh", that.state.park_details);
      }
    });
  }

  //////////////////////////////////////////////////////////////////////// >> Amenity

  toggleAmenityHandler(index) {
    let that = this;
    let parkAmenity = that.state.park_amenities;
    parkAmenity[index]["amenityValue"] = "";
    parkAmenity[index]["isChecked"] = !parkAmenity[index]["isChecked"];
    that.setState({ park_amenities: parkAmenity });
  }

  amenityValueHandler(index, value) {
    let that = this;
    let parkAmenity = that.state.park_amenities;
    parkAmenity[index]["amenityValue"] = value;
    that.setState({ park_amenities: parkAmenity });
  }

  getAllAmenitiesList() {
    let that = this;
    axios.post(path + "admin/get_amenity_list").then(serverResponse => {
      console.log("Park list here : ", serverResponse);
      const res = serverResponse.data;
      if (!res.isError) {
        res.details.map(n => {
          n["isChecked"] = false;
          n["amenityValue"] = "";
          return n;
        });
        that.setState({ park_amenities: res.details });
        console.log("hh", that.state.park_amenities);
      }
    });
  }

  /////////////////////////////////////////////////////////////////////// >> Pavilion Details

  togglePavilionDetailsHandler(index) {
    let that = this;
    let parkPavilionDetails = that.state.pavilion_details;
    parkPavilionDetails[index]["pdetailsValue"] = "";
    parkPavilionDetails[index]["isChecked"] = !parkPavilionDetails[index][
      "isChecked"
    ];
    that.setState({ pavilion_details: parkPavilionDetails });
    // console.log(that.state.pavilion_details);
  }

  pavilionDetailsValueHandler(index, value) {
    let that = this;
    let parkPavilionDetails = that.state.pavilion_details;
    parkPavilionDetails[index]["pdetailsValue"] = value;
    that.setState({ pavilion_details: parkPavilionDetails });
    // console.log(that.state.pavilion_details);
  }

  getAllPavilionDetailsList() {
    let that = this;
    axios
      .post(path + "admin/get_pavilion_details_list")
      .then(serverResponse => {
        const res = serverResponse.data;
        if (!res.isError) {
          res.details.map(n => {
            n["isChecked"] = false;
            n["pdetailsValue"] = "";
            return n;
          });
          that.setState({ pavilion_details: res.details });
          console.log("pav", that.state.pavilion_details);
        }
      });
  }

  addEditPavilion() {
    // let that = this;
    let currentModalMode = this.state.pavilionModalMode;
    let oldPavilionDetails = this.state.park_pavilions;
    let newPavilionDetails = {
      pavilion_id: this.state.park_pavilions.length + 1,
      pavilion_name: this.state.pavilion_name,
      pavilion_reservation_url: this.state.pavilion_reservation_url,
      pavilion_lat: this.state.pavilion_lat,
      pavilion_long: this.state.pavilion_long,
      pavilion_isReservable: this.state.pavilion_isReservable,
      pavilion_pictures: this.state.pavilion_pictures,
      pavilion_details: this.state.pavilion_details
    };

    if (currentModalMode == "ADD") {
      // console.log(oldPavilionDetails);
      oldPavilionDetails.push(newPavilionDetails);
      this.setState({ park_pavilions: oldPavilionDetails });
      console.log("___________ @ ____________", oldPavilionDetails);
    } else {
      let editId = this.state.pavilion_id;
      oldPavilionDetails.map(eachPav => {
        if (eachPav.pavilion_id == editId) {
          eachPav["pavilion_name"] = this.state.pavilion_name;
          eachPav[
            "pavilion_reservation_url"
          ] = this.state.pavilion_reservation_url;
          eachPav["pavilion_lat"] = this.state.pavilion_lat;
          eachPav["pavilion_long"] = this.state.pavilion_long;
          eachPav["pavilion_isReservable"] = this.state.pavilion_isReservable;
          eachPav["pavilion_pictures"] = this.state.pavilion_pictures;
          eachPav["pavilion_details"] = this.state.pavilion_details;
        }
      });
      this.setState({ park_pavilions: oldPavilionDetails });
      console.log("___________ @@ ____________", oldPavilionDetails);
    }
    this.setState({
      pavilion_id: 0,
      pavilion_name: "",
      pavilion_reservation_url: "",
      pavilion_lat: "",
      pavilion_long: "",
      pavilion_isReservable: "",
      pavilion_pictures: []
    });
    this.setState({
      pavilionModal: !this.state.pavilionModal
    });
  }

  removePavilion(pavId) {
    let oldParkPavArr = this.state.park_pavilions;
    let newParkPavArr = oldParkPavArr.filter(
      parkPav => parkPav.pavilion_id !== pavId
    );
    this.setState({ park_pavilions: newParkPavArr });
  }

  editPavilion(pavId) {
    this.openPavilionModal("EDIT");
    let oldParkPavArr = this.state.park_pavilions;
    oldParkPavArr.map(parkPav => {
      if (parkPav.pavilion_id == pavId) {
        this.setState({
          pavilionModalMode: "EDIT",
          pavilion_id: parkPav.pavilion_id,
          pavilion_name: parkPav.pavilion_name,
          pavilion_reservation_url: parkPav.pavilion_reservation_url,
          pavilion_lat: parkPav.pavilion_lat,
          pavilion_long: parkPav.pavilion_long,
          pavilion_isReservable: parkPav.pavilion_isReservable,
          pavilion_pictures: parkPav.pavilion_pictures,
          pavilion_details: parkPav.pavilion_details
        });
      }
    });
  }

  closePavilionModal() {
    this.setState({
      pavilion_id: 0,
      pavilion_name: "",
      pavilion_reservation_url: "",
      pavilion_lat: "",
      pavilion_long: "",
      pavilion_isReservable: "",
      pavilion_pictures: []
    });
    this.setState({
      pavilionModal: !this.state.pavilionModal
    });
  }

  ////////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    let cityAdminCity = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityName"];
    let isPremium = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["isActive"]; // NOTE change isActive to a new value once you get access to the admin panel
    let cityAdminCityId = JSON.parse(
      localStorage.getItem("picnic_cityadmin_cred")
    )["data"]["cityId"];
    let cityAdminId = JSON.parse(localStorage.getItem("picnic_cityadmin_cred"))[
      "data"
    ]["userId"];
    this.setState({
      park_city: cityAdminCity,
      park_cityId: cityAdminCityId,
      last_updated_by: cityAdminId,
      is_premium: isPremium
    });
    this.getAllDetailsList();
    this.getAllAmenitiesList();
    if (this.props.match.params.id != "new") {
      this.getParkDetails();
      this.setState({
        parkMode: "EDIT",
        park_id: this.props.match.params.id
      });
    }
  }

  handleSubmit() {
    console.log(this.state);
    this.addEditPark(this.state.parkMode);
  }

  addEditPark(action_type) {
    // let dataToSend = { ...this.state };
    let that = this;
    let dataToSend = {
      park_id: that.state.park_id,
      park_name: that.state.park_name,
      park_email: that.state.park_email,
      park_mobile: that.state.park_mobile,
      park_address: that.state.park_address,
      park_city: that.state.park_city,
      park_city_id: that.state.park_cityId,
      park_zip_code: that.state.park_zip_code,
      park_lat: that.state.park_lat,
      park_long: that.state.park_long,
      park_acre: that.state.park_acre,
      // park_default_picture: that.state.park_default_picture,
      park_default_picture: that.state.park_pictures[0],
      park_pictures: that.state.park_pictures,
      park_amenities: that.state.park_amenities,
      park_details: that.state.park_details,
      park_pavilions: that.state.park_pavilions,
      last_updated_by: that.state.last_updated_by,
      park_verified: that.state.park_verified,
      park_message: that.state.park_message
    };

    dataToSend.operation_type = action_type;
    console.log(dataToSend);
    axios
      .post(path + "cityadmin/add_edit_park", dataToSend)
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
          this.props.history.push("/parklist");
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
      this._uploadImage(event, "park").then(result => {
        let park_image = result.toString();
        let that = this;
        let parkPicArr = that.state.park_pictures;
        parkPicArr.push(park_image);
        this.setState({ park_pictures: parkPicArr });
      });
    }
  };

  saveImagePathPavilion = event => {
    if (event) {
      this._uploadImage(event, "pavilion").then(result => {
        let pavilion_image = result.toString();
        let that = this;
        let pavilionPicArr = that.state.pavilion_pictures;
        pavilionPicArr.push(pavilion_image);
        this.setState({ pavilion_pictures: pavilionPicArr });
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
                <strong>Park Details</strong>
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
                              <Label htmlFor="park_name">Name</Label>
                              <Input
                                type="text"
                                name="park_name"
                                value={this.state.park_name}
                                placeholder="Enter your park name"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="park_email">
                                Support Email(s)
                              </Label>
                              <Input
                                type="text"
                                name="park_email"
                                value={this.state.park_email}
                                placeholder="abc@xyz.com, def@xyz.com, ghi@abc.com, ..."
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="mobile">City Office Phone Number</Label>
                              <Input
                                type="text"
                                name="park_mobile"
                                value={
                                  this.state.park_mobile
                                    ? this.state.park_mobile
                                    : ""
                                }
                                placeholder="Enter office number"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                type="text"
                                name="park_address"
                                value={this.state.park_address}
                                placeholder="Enter park address"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                          </Row>
                          <Row style={mb20}>
                            <Col md="3">
                              <Label htmlFor="city">City</Label>
                              <Input
                                type="text"
                                name="park_city"
                                value={this.state.park_city}
                                placeholder="Enter your city"
                                onChange={event => this.handleChange(event)}
                                readonly="true"
                              />
                            </Col>
                            <Col md="3">
                              <Label htmlFor="postal-code">Postal Code</Label>
                              <Input
                                type="text"
                                name="park_zip_code"
                                value={this.state.park_zip_code}
                                placeholder="Postal Code"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>

                            <Col md="3">
                              <Label htmlFor="parkLat">
                                Park Latitude & Longitude
                              </Label>
                              <div
                                className="flexContainer"
                                style={flexDisplay}
                              >
                                <Input
                                  type="text"
                                  name="park_lat"
                                  value={
                                    this.state.park_long +
                                    ", " +
                                    this.state.park_lat
                                  }
                                  placeholder="Enter Park Latitude and Longitude"
                                  onChange={event => this.handleChange(event)}
                                  readonly="true"
                                  style={flexDisplay2}
                                />
                                <button onClick={() => this.openMapModal()}>
                                  Edit
                                </button>
                              </div>
                            </Col>
                            <Col md="3">
                              <Label htmlFor="parkAcre">Park Acreage</Label>
                              <Input
                                type="text"
                                name="park_acre"
                                value={this.state.park_acre}
                                placeholder="Enter Park Acreage"
                                onChange={event => this.handleChange(event)}
                              />
                            </Col>
                          </Row>
                          <Row style={mb20}>
                            <Col md="3">
                                <Label>Is City Verified (Pro)</Label><br/>
                                <AppSwitch className={"mx-1"} variant={"pill"} color={"success"} checked={this.state.park_verified}
                                onChange={event => this.handleChange(event)}
                                name="park_verified"
                                //disabled={this.state.is_premium == false}
                            // checked={eachDetails.isParkVerified}
                            // onClick={() =>
                            //   this.toggleSwitchHandler(eachDetails.parkId)
                            // }
                          />
                        </Col>
                        <Col md="3">
                              <Label htmlFor="parkMessage">Custom Alert Message (Pro)</Label>
                              <Input
                                type="text"
                                name="park_message"
                                value={this.state.park_message}
                                placeholder="Enter alert message (optional)"
                                onChange={event => this.handleChange(event)}
                                //disabled={this.state.is_premium == false}
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Park pictures */}
                    <h6>Park Pictures</h6>
                    <Row>
                      {this.state.park_pictures.map(pic => {
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

                    {/* Park details and amenities */}

                    <Row>
                      {/* Park details */}
                      <Col md="6">
                        <h6 style={mb20}>Park Details</h6>
                        {this.state.park_details.map((eachDetails, index) => {
                          return (
                            <Row style={mb5} key={eachDetails.gdetailsId}>
                              <Col md="6">
                                <div className="form-check form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={eachDetails.gdetailsId}
                                      checked={eachDetails.isChecked}
                                      onChange={() =>
                                        this.toggleDetailsHandler(index)
                                      }
                                    />
                                    {eachDetails.gdetailsName}
                                  </label>
                                </div>
                              </Col>
                              <Col md="6">
                                <input
                                  className="form-control"
                                  name={eachDetails.gdetailsId}
                                  type="text"
                                  disabled={!eachDetails.isChecked}
                                  value={eachDetails.detailsValue}
                                  onChange={event =>
                                    this.detailsValueHandler(
                                      index,
                                      event.target.value
                                    )
                                  }
                                />
                              </Col>
                            </Row>
                          );
                        })}
                      </Col>

                      {/* Park Amenities */}
                      <Col md="6">
                        <h6 style={mb20}>Park Amenities</h6>
                        {this.state.park_amenities.map((eachAmenity, index) => {
                          return (
                            <Row style={mb5} key={eachAmenity.amenityId}>
                              <Col md="6">
                                <div className="form-check form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={eachAmenity.amenityId}
                                      checked={eachAmenity.isChecked}
                                      onChange={() =>
                                        this.toggleAmenityHandler(index)
                                      }
                                    />
                                    {eachAmenity.amenityName}
                                  </label>
                                </div>
                              </Col>
                              <Col md="6">
                                <input
                                  className="form-control"
                                  name={eachAmenity.amenityId}
                                  type="text"
                                  disabled={!eachAmenity.isChecked}
                                  value={eachAmenity.amenityValue}
                                  onChange={event =>
                                    this.amenityValueHandler(
                                      index,
                                      event.target.value
                                    )
                                  }
                                />
                              </Col>
                            </Row>
                          );
                        })}
                      </Col>
                    </Row>
                  </Col>

                  {/* Park pavillions */}
                  <Col md="2" style={borderV}>
                    <Row className="justify-content-center">
                      <p>Park Pavillions</p>
                      <Col md="12">
                        {this.state.park_pavilions &&
                          this.state.park_pavilions.map(pav => {
                            return (
                              <Card>
                                <CardBody style={pavThumb}>
                                  <img
                                    src={pav.pavilion_pictures[0]}
                                    className="pavImgThumb"
                                  />
                                </CardBody>
                                <CardFooter>
                                  <Row>
                                    <Col md="8">{pav.pavilion_name}</Col>
                                    <Col md="4" style={availableOptions}>
                                      <span>
                                        <i
                                          className="fa fa-edit"
                                          style={editIconStyle}
                                          onClick={() =>
                                            this.editPavilion(pav.pavilion_id)
                                          }
                                        />
                                        <i
                                          className="fa fa-trash"
                                          style={deleteIconStyle}
                                          onClick={() =>
                                            this.removePavilion(pav.pavilion_id)
                                          }
                                        />
                                      </span>
                                    </Col>
                                  </Row>
                                </CardFooter>
                              </Card>
                            );
                          })}

                        <Card style={addBtn}>
                          <CardBody
                            onClick={() => this.openPavilionModal("ADD")}
                          >
                            <i className="fa fa-plus fa-3x" />
                          </CardBody>
                        </Card>
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
                  <Link to="/parklist">
                    <Button className="btn btn-default submitStyle mx-3">
                      CANCEL
                    </Button>
                  </Link>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Map modal */}

        <Modal
          isOpen={this.state.mapModal}
          toggle={this.openMapModal}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.openMapModal}>
            Choose correct position
          </ModalHeader>
          <ModalBody
            style={{
              width: "210px",
              height: "340px"
            }}
          >
            <Row>
              <Col md="12">
                <GoogleApiWrapper
                  parkLocLat={this.state.park_lat}
                  parkLocLong={this.state.park_long}
                  updateLoc={this.updateLoc.bind(this)}
                ></GoogleApiWrapper>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        {/* Add new pavilion modal */}

        <Modal
          isOpen={this.state.pavilionModal}
          toggle={this.openPavilionModal}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.openPavilionModal}>
            Add New Pavilion
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12">
                {/* Pavilion basic details */}
                <Row style={mb20}>
                  <Col md="12">
                    <FormGroup>
                      <Row style={mb20}>
                        <Col md="4">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            type="text"
                            name="pavilion_name"
                            value={this.state.pavilion_name}
                            placeholder="Enter your pavilion name"
                            onChange={event => this.handleChange(event)}
                          />
                        </Col>
                        <Col md="6">
                          <Label htmlFor="reservationurl">
                            Pavilion reservation url
                          </Label>
                          <Input
                            type="text"
                            name="pavilion_reservation_url"
                            value={this.state.pavilion_reservation_url}
                            placeholder="Enter pavilion reservation url"
                            onChange={event => this.handleChange(event)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            type="text"
                            name="pavilion_lat"
                            value={this.state.pavilion_lat}
                            placeholder="Enter pavilion latitude"
                            onChange={event => this.handleChange(event)}
                          />
                        </Col>
                        <Col md="4">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            type="text"
                            name="pavilion_long"
                            value={this.state.pavilion_long}
                            placeholder="Enter pavilion longitude"
                            onChange={event => this.handleChange(event)}
                          />
                        </Col>
                        <Col md="3">
                          <Label>Is reservable</Label>
                          <AppSwitch
                            className={"mx-1"}
                            variant={"pill"}
                            color={"success"}
                            checked={this.state.pavilion_isReservable}
                            // checked={eachDetails.isParkVerified}
                            // onClick={() =>
                            //   this.toggleSwitchHandler(eachDetails.parkId)
                            // }
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Pavilion pictures */}
                <h6>Pavilion Pictures</h6>
                <Row>
                  {/* <Col md="3">
                    <Card>
                      <CardBody style={noPadding}>
                        <img src="https://via.placeholder.com/175x150/0F0F0F/808080" />
                      </CardBody>
                    </Card>
                  </Col> */}
                  {this.state.pavilion_pictures.map(pic => {
                    return (
                      <Col md="3">
                        <Card>
                          <CardBody style={noPadding}>
                            <img src={pic} style={pavImgThumb} />
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                  <Col md="3">
                    <Card style={addBtn}>
                      <Input
                        type="file"
                        style={fileInputStyle}
                        onChange={this.saveImagePathPavilion}
                      />
                      <CardBody>
                        <div style={uploadBtnWrapper}>
                          <i className="fa fa-plus fa-3x" />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="2">
                    <div />
                  </Col>
                </Row>

                <Row>
                  {/* Pavilion details */}
                  <Col md="6">
                    <h6 style={mb20}>Pavilion Details</h6>
                    {this.state.pavilion_details.map((eachDetails, index) => {
                      return (
                        <Row style={mb5} key={eachDetails.pdetailsId}>
                          <Col md="6">
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={eachDetails.pdetailsId}
                                  checked={eachDetails.isChecked}
                                  onChange={() =>
                                    this.togglePavilionDetailsHandler(index)
                                  }
                                />
                                {eachDetails.pdetailsName}
                              </label>
                            </div>
                          </Col>
                          <Col md="6">
                            <input
                              className="form-control"
                              name={eachDetails.pdetailsId}
                              type="text"
                              value={eachDetails.pdetailsValue}
                              disabled={!eachDetails.isChecked}
                              onChange={event =>
                                this.pavilionDetailsValueHandler(
                                  index,
                                  event.target.value
                                )
                              }
                            />
                          </Col>
                        </Row>
                      );
                    })}
                  </Col>
                </Row>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={() => this.addEditPavilion()}>
              {this.state.pavilionModalMode}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default AddEditComponent;
