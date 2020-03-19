import React, { Component } from 'react';
import { Elements, StripeProvider, CardElement, injectStripe } from "react-stripe-elements";
import {loadStripe} from '@stripe/stripe-js';
import { useStripe, useElements} from '@stripe/react-stripe-js';

import './Modal.css';
import CardDemo from './CardDemo';
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


const modal = (props) => {
    return (
        <div>
            <div className="modal fade show"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    display: props.show ? 'block' : 'none'
                }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                        <h3>Payment</h3>
                          <span className="close-modal-btn" onClick={props.close}>×</span>
                   </div>
                   <div className="modal-body">
                    <CardDemo />
                   </div>
                   <div className="modal-footer">
                      <button className="btn-cancel" onClick={props.close}>CLOSE</button>
                   </div>
               </div>
            </div>
        </div>
      </div>
    )
}

export default modal;
