import React, { Component } from "react";
import axios from "axios";
// import history from ''
import {
  // Badge,
  Button,
  Card,
  CardBody,
  // CardFooter,
  CardHeader,
  Col,
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
var path = cred.API_PATH + "admin/";

// import { link } from "fs";
// var path = 'http://localhost:3132/v1/admin/';

// var path = process.env.API_PATH + "admin/";

class AddEditComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id : "",
      user_name: "",
      user_email: "",
      user_password: "",
      user_mobile: "",
      user_city: "",
      user_is_approved: "",
      user_default_picture: "",
    };

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(event) {
  //   const target = event.target;
  //   const value = target.type === "checkbox" ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   });
  // }

//   getuserDetails() {
//     let dataToSend = {
//       user_id: this.props.match.params.id
//     };
//     axios
//       .post(path + "get_user_details", dataToSend, {
//         headers: { "Content-Type": "application/json" }
//       })
//       .then(serverResponse => {
//         console.log("Response from here : ", serverResponse);
//         const res = serverResponse.data;
//         if (!res.isError) {
//           console.log(res);
//           this.setState({
//             user_name: res["details"]["userName"],
//             user_email: res["details"]["userEmail"],
//             user_mobile: res["details"]["userMobile"],
//             user_address: res["details"]["userAddress"],
//             user_city: res["details"]["userCity"],
//             user_zip_code: res["details"]["userZipCode"],
//             user_lat: res["details"]["userCoordinate"]["coordinates"][0],
//             user_long: res["details"]["userCoordinate"]["coordinates"][1],
//             user_amenities: res["details"]["userAmenities"],
//             user_details: res["details"]["userDetails"],
//             user_default_picture: res["details"]["userDefaultPic"]
//           });
//           // alert('Success');
//           // history.push('/userlist')
//         }
//       });
//   }

  componentDidMount() {
    // this.getuserDetails();
  }

  handleSubmit(event) {
    console.log(this.state);
    this.addEdituser('ADD')
  }

  addEdituser(action_type){
    let dataToSend = {...this.state};
    dataToSend.operation_type = action_type
    axios
    .post(path + "add_edit_user",dataToSend,{headers:{'Content-Type':'application/json'}})
    .then(serverResponse => {
      console.log("Response from here : ", serverResponse);
      const res = serverResponse.data;
      if (!res.isError) {
        // alert('Success');
        // history.push('/userlist')
      }
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>user Details</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" sm="6">
                    <img src={this.state.user_default_picture} />
                  </Col>
                  <Col xs="12" sm="6">
                    <FormGroup>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        name="user_name"
                        value={this.state.user_name}
                        placeholder="Enter your user name"
                        readOnly
                        // onChange={this.handleChange}
                      />
                    </FormGroup>

                    <FormGroup row className="my-0">
                      <Col xs="6">
                        <FormGroup>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            type="email"
                            name="user_email"
                            value={this.state.user_email}
                            placeholder="abc@xyz.com"
                            readOnly
                            readOnly
                            // onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <Label htmlFor="mobile">Mobile</Label>
                          <Input
                            type="text"
                            name="user_mobile"
                            value={this.state.user_mobile}
                            placeholder="Enter mobile number"
                            readOnly
                            // onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="address">Password</Label>
                      <Input
                        type="password"
                        name="user_password"
                        value={this.state.user_password}
                        placeholder="*******"
                        readOnly
                        // onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup row className="my-0">
                      <Col xs="6">
                        <FormGroup>
                          <Label htmlFor="city">City</Label>
                          <Input
                            type="text"
                            name="user_city"
                            value={this.state.user_city}
                            placeholder="Enter your city"
                            readOnly
                            // onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>                     
                    </FormGroup>                    
                  </Col>
                </Row>
                <Row>
                  <div>
                    <Button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.handleSubmit()}
                    >
                      SUBMIT
                    </Button>
                  </div>
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
