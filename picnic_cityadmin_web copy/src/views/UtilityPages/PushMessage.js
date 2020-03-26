import React from 'react';
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
import { Link } from 'react-router-dom';
import axios from 'axios';
import cred from "../../cred.json";
var path = cred.API_PATH + "admin/";


class PushMessage extends React.Component {
    render() {
        let user = localStorage.getItem('picnic_cityadmin_cred');
        user = typeof user === 'string' ? JSON.parse(user) : user;
        console.log('this is the state in push message', this.state)
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
        const { title, description, to, handleChange, handleSubmit } = this.props

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Push Notification Details</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="10">
                                        {/* Park basic details */}
                                        <Row style={mb20}>
                                            <Col md="12">
                                                <FormGroup>
                                                    <Row style={mb20}>
                                                        <Col md="6">
                                                            <Label htmlFor="mobile">Title</Label>
                                                            <Input
                                                                type="text"
                                                                name="title"
                                                                value={
                                                                    title
                                                                        ? title
                                                                        : ""
                                                                }
                                                                placeholder="Enter Title"
                                                                onChange={event => handleChange(event)}
                                                                required
                                                            />
                                                        </Col>



                                                    </Row>
                                                    {/* <Row>
                                                        <Col md="6">
                                                            <Label for="exampleSelect">Select</Label>
                                                            <Input type="select" name="to" id="to" onChange={this.props.handleChange} value={to}>
                                                                <option value="users">Users</option>
                                                                {
                                                                    user.data.userType === 'SUPER-ADMIN' ? (
                                                                        <React.Fragment>
                                                                            <option value="all">All</option>
                                                                            <option value="city-admins">City Admins</option>
                                                                        </React.Fragment>
                                                                    ) : ''
                                                                }


                                                            </Input>
                                                        </Col>
                                                    </Row> */}
                                                    <Row style={mb20}>
                                                        <Col md="10">
                                                            <Label>Description</Label><br />
                                                            <textarea
                                                                type="text"
                                                                name="description"
                                                                value={description}
                                                                placeholder="Enter Description"
                                                                onChange={event => handleChange(event)}
                                                                style={{ width: '100%' }}
                                                                rows={8}
                                                                required
                                                            />
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
                                        onClick={() => handleSubmit()}
                                    >
                                        Send To Users
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

export default PushMessage;