import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import cred from "../../../cred.json";
import logo from '../../../assets/img/brand/grassy_logo.png'
import StripeCheckout from "react-stripe-checkout";
import Modal from '../Payment/Modal';
import swal from 'sweetalert';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
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

class Package extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authMessage: "",
      selectedOption: null,
      inputValue: "",
      isShowing: false
    };
    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModalHandler = this.openModalHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);

  }

  /*Open modal handleer*/
  openModalHandler = (e) => {
    console.log('Plan name', e);
    localStorage.setItem('planname', e);
      this.setState({
          isShowing: true
      });
  }

  /*close modal handleer*/
  closeModalHandler = () => {
      this.setState({
          isShowing: false
      });
  }

  handleSubmit(e) {
    let payment = 0;
    let i = 0;
    if(e == 'free') {
      payment = 0;
    } else if (e == 'pro-m') {
      payment = 3;
    } else if (e == 'pro-a') {
      payment = 2;
    } else {
      i++;
    }

    if(i > 0) {
      alert('Please select any plan!');
      return false;
    } else {
      if( payment == 0) {
        swal({
          title: "Free Trial!",
          text: "You will be given free trial for 10 days!",
          icon: "warning",
          buttons: {
            cancel: "Close",
            Proceed: true
          },
          dangerMode: true,
        })
        .then(willupgrade => {
          if (willupgrade) {
            this.props.history.push("/parklist");
          }
        });
      }
    }
  }


  render() {
    const errMsg = {
      color: "RED",
      fontFamily: "Monospace"
    };


    return (
      <React.Fragment>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="12">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <div>
                      <CardGroup className="step02">
                        <Card className="p-4">
                        <CardBody>
                        <h1>Select Package</h1>
                        <p className="text-muted"></p>
                        <Row>
                          <Col md="4">
                          <CardGroup className="pack-wl">
                            <Card className="p-4">
                            <CardTitle>
                              <span className="em">Free</span>
                            </CardTitle>
                              <p className="price-banner">
                                <span className="price-currency"></span>
                                <span className="price-digits">FREE</span>
                                <span className="price-extra"></span>
                              </p>
                              <CardBody>
                              <ul className="list-border-dots">
                                <li>Host unlimited parks in our apps.</li>
                                <li>Add park amenities and details.</li>
                                <li>Add up to five photos per park.</li>
                                <li>Gather reviews from citizens.</li>
                                <li>Add pavilion details for parks.</li>
                                <li>Unlimited email support.</li>
                              </ul>
                              <Button
                              color="primary"
                                className="btn btn-primary" value="free"
                                onClick={() => {
                                  this.handleSubmit('free');
                                }}
                              >
                              Proceed to Payment
                              </Button>
                              </CardBody>
                            </Card>
                            </CardGroup>
                          </Col>
                          <Col md="4">
                          <CardGroup className="pack-wl">
                            <Card className="p-4">
                            <div className="card-ribbon card-ribbon-top">Free Trial</div>
                            <CardTitle>
                              <span className="em">Pro - Monthly</span>
                            </CardTitle>
                              <p className="price-banner">
                                <span className="price-currency">$</span>
                                <span className="price-digits">3</span>
                                <span className="price-extra">/Park/Month</span>
                              </p>
                              <CardBody>
                              <ul className="list-border-dots">
                                <li><b>All of the free features, plus:</b></li>
                                <li>Unlimited photos for each park.</li>
                                <li>Access analytics from check-ins.</li>
                                <li>Host give-away contests in the app.</li>
                                <li>Show "Report a Problem" button.</li>
                                <li>Show verified flag for each park.</li>
                                <li>Park-specific alert message area.</li>
                                <li>Push notification access.</li>
                                <li>Link to city pavilion rental pages.</li>
                                <li>Process pavilion rentals in the app.</li>
                                <li>Unlimited phone support.</li>
                                <li>100% satisfaction guarantee.</li>
                                <li>Free three month trial!</li>
                              </ul>
                              <Button
                              color="primary"
                                className="btn btn-primary"
                                onClick={() => { this.openModalHandler('pro-m')}}
                              >
                                Proceed to Payment
                              </Button>
                              </CardBody>
                            </Card>
                            </CardGroup>
                          </Col>
                          <Col md="4">
                          <CardGroup className="pack-wl">
                            <Card className="p-4">
                            <div className="card-ribbon card-ribbon-left">Best Buy</div>
                            <CardTitle>
                              <span className="em">Pro - Annual</span>
                            </CardTitle>
                              <p className="price-banner">
                                <span className="price-currency">$</span>
                                <span className="price-digits">2</span>
                                <span className="price-extra">/Park/Month</span>
                              </p>
                              <CardBody>
                              <ul className="list-border-dots">
                                <li>All of the free features.</li>
                                <li>All of the pro features.</li>
                                <li>Save 33% over the monthly plan.</li>
                                <li>Pay upfront for the full year.</li>
                              </ul>
                              <Button
                              color="primary"
                                className="btn btn-primary"
                                onClick={() => { this.openModalHandler('pro-a')}}
                              >
                                Proceed to Payment
                              </Button>
                            </CardBody>
                            </Card>
                            </CardGroup>
                          </Col>
                        </Row>
                        </CardBody>
                        </Card>
                      </CardGroup>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
        <Modal
            className="modal"
            show={this.state.isShowing}
            close={this.closeModalHandler}>
                Maybe aircrafts fly very high because they don't want to be seen in plane sight?
        </Modal>
      </React.Fragment>
    );
  }
}

export default Package;
