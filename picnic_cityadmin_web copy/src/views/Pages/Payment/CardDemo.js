import React, {Component} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


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
import swal from 'sweetalert';
import axios from "axios";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import cred from "../../../cred.json";
var path = cred.API_PATH + "user/";
// You can customize your Elements to give it the look and feel of your site.
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    }
  }
};

class _CardForm extends Component {

  constructor(props) {
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleChange = this.handleChange.bind(this);

 }
  state = {
    errorMessage: '',
  };

  handleChange = ({error}) => {
    if (error) {
      this.setState({errorMessage: error.message});
    }
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    if (this.props.stripe) {
      // let token = this.props.stripe.createToken().then(this.props.handleResult);
      /*Verify is user is logged in or not*/
      var picniccitydata = JSON.parse(localStorage.getItem('picnic_cityadmin_cred'));

      var user_name = picniccitydata["data"]["name"];
      var cityName = picniccitydata["data"]["cityName"];
      var email = picniccitydata["data"]["email"];
      var userId = picniccitydata["data"]["userId"];
      var planName = localStorage.getItem('planname');

      this.props.stripe.createToken({
        name: user_name,
        email:email,
        address_line1: this.props.stripe.address,
        address_city: cityName,
        address_state: this.props.stripe.state,
        address_zip: this.props.stripe.zipCode,
        address_country: this.props.stripe.country
      }).then(({ token }) => {
           if (token != '') {
             console.log('inside', token);
             let dataToSend = {
               token: token,
               plan:planName,
               userId:userId,
               email:email
             };

             axios
               .post(path + "create_payment", dataToSend, {
                 headers: { "Content-Type": "application/json" }
               })
               .then(serverResponse => {
                 console.log("Response from here : ", serverResponse);
                 const res = serverResponse.data;
                 if (!res.isError) {
                    swal('', res.message, 'success');
                    localStorage.setItem('proFlag', 1);
                    window.location.href = "/dashboard";
                 } else {
                   swal('', 'Issue in processig payment', 'failure');
                 }
               });
           } else {
             return;
           }
      });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  // componentDidMount(){
  //   var picniccitydata = localStorage.getItem('picnic_cityadmin_cred');
  //   if(picniccitydata != '') {
  //         window.location.href = "/dashboard";
  //   }
  // }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
      <Row className="justify-content-center">
      <Col md="12">
        <Row className="form-group">
          <Col md="12">
            <label className="label-control">Card number</label>
            <CardNumberElement
            className="form-control"
            {...createOptions()}
            onChange={this.handleChange}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col md="4">
            <label className="label-control">Exp. date</label>
            <CardExpiryElement
            className="form-control"
              {...createOptions()}
              onChange={this.handleChange}
            />
          </Col>
          <Col md="4">
            <label className="label-control">CVC</label>
            <CardCVCElement className="form-control" {...createOptions()} onChange={this.handleChange} />
          </Col>
          <Col md="4">
            <label className="label-control">Postal code</label>
            <input
              name="name"
              type="text"
              placeholder="94115"
              className="StripeElement form-control"
              required
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col md="12">
          <div className="error" role="alert">
            {this.state.errorMessage}
          </div>
          </Col>
        </Row>

        <Row className="form-action">
          <Col md="12">
            <Button
            color="primary"
            className="btn"
            >Pay</Button>
          </Col>
        </Row>
        </Col>
        </Row>
      </form>
    );
  }
}

const CardForm = injectStripe(_CardForm);

class CardDemo extends Component {
  render() {
    const stripePromise = 'pk_test_FxQrBKwEbsX39hjzXws1NxQG00g0qy20ni';
    return (
      <StripeProvider apiKey={stripePromise}>
        <Elements>
          <CardForm handleResult={this.props.handleResult} />
        </Elements>
      </StripeProvider>
    );
  }
}

export default CardDemo;
