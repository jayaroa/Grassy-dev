import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Label,
  Row
} from "reactstrap";
// import { stat } from "fs";
import cred from "../../cred.json";
var path = cred.API_PATH + "admin/";

// var path = 'http://localhost:3132/v1/admin/';

// var path = process.env.API_PATH + "admin/";

class City extends Component {
  constructor(props) {
    super(props);
    // this.handleNameChange = this.handleNameChange.bind(this)

    this.state = {
      idToEdit: "",
      value: "",
      Aminities: [],
      addEdit: "ADD"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
    // this.handleDelete = this.handleSubmit.bind(this);
  }

  // loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>


  componentDidMount() {
    let pro = localStorage.getItem('proFlag');
    if(pro == 'undefined' || pro == undefined || pro == null  || pro == 'null' ) {
      alert('Error in getting logged variable');
      this.props.history.push("/login");
    } else {
      if( pro == 0) {
        this.getCityList();
      } else if(pro == 2) {
        this.props.history.push("/package");
      } else {
        console.log(' a pro user');
        this.getCityList();
      }
    }
  }


  // --------------------- Handler code starts here ------------------------------//

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log("A name was submitted: " + this.state.value);
    this.addEditCity("ADD", this.state.value);
    event.preventDefault();
  }

  changeToEditMode(id, name) {
    this.setState({
      addEdit: "EDIT",
      idToEdit: id,
      value: name
    });
  }

  handleEdit(value) {
    this.addEditCity("EDIT", value, this.state.idToEdit);
  }

  handleDelete(id) {
    this.removeCity(id);
  }

  // --------------------- Handler code ends here ------------------------------//

  // --------------------- AJAX related calls starts here ------------------------------//

  addEditCity(...details) {
    if (details[1] !== "") {
      axios
        .post(path + "add_edit_city", {
          operation_type: details[0],
          city_name: details[1],
          city_id: details[2]
        })
        .then(serverResponse => {
          console.log("Response from here : ", serverResponse);
          const res = serverResponse.data;
          if (!res.isError) {
            this.getCityList();
            this.setState({
              addEdit: "ADD",
              idToEdit: "",
              value: ""
            });
          }
        });
    } else {
      alert("Please provide some name");
    }
  }

  removeCity(cityId) {
    axios
      .post(path + "remove_city", {
        city_id: cityId
      })
      .then(serverResponse => {
        console.log("Response from here : ", serverResponse);
        const res = serverResponse.data;
        if (!res.isError) {
          this.getCityList();
        }
      });
  }

  getCityList() {
    axios.post(path + "get_city_list").then(serverResponse => {
      console.log("Response from here : ", serverResponse);
      const res = serverResponse.data;
      if (!res.isError) {
        const Aminities = res.details;
        this.setState({ Aminities });
      }
    });
  }

  // --------------------- AJAX related calls ends here ------------------------------//

  render() {
    const pillStyle = {
      margin: "5px 0px",
      background: "#cacfd4",
      borderRadius: "5px",
      color: "#0c0b0b",
      // padding: "16px 20px",
      boxShadow: "2px 2px 3px 1px #c0c1c1"
    };

    const editPanel = {
      float: "right"
    };

    // function AddOrUpdate() {
    //   const isAddOrEdit = this.state.addEdit;
    //   if (isAddOrEdit=='ADD') {
    //     return  <Button type="submit" size="sm"  color="success">Submit</Button>;
    //   }
    //   return  <Button type="button" size="sm"  color="success">Update</Button>;
    // }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="6">
            <Card>
              <CardHeader>
                <strong>Add City</strong>
              </CardHeader>
              <CardBody>
                <Form className="form-horizontal" onSubmit={this.handleSubmit}>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="city-namme">City Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter City Name..."
                        value={this.state.value}
                        onChange={this.handleChange}
                      />
                    </Col>
                  </FormGroup>
                  {this.state.addEdit === "ADD" ? (
                    <Button type="submit" size="sm"  color="success">
                      Submit
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                       color="success"
                      onClick={() => this.handleEdit(this.state.value)}
                    >
                      Update
                    </Button>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <h2>City List</h2>
        <Row>
          {this.state.Aminities.map(eachCity => (
            <Col xs="6" md="2" key={eachCity.cityId}>
              <div
                style={pillStyle}
                className="d-flex justify-content-between align-items-center p-2"
              >
                <span>{eachCity.cityName}</span>
                <div className="d-inline-flex editPanel">
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() =>
                      this.changeToEditMode(eachCity.cityId, eachCity.cityName)
                    }
                  >
                    <i className="fa fa-edit" />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(eachCity.cityId)}
                  >
                    <i className="fa fa-remove" />
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default City;
