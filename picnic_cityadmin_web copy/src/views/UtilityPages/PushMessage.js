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
    state = {
        title: '',
        description: '',
        to: 'all'
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = async () => {
        try {
            let user = localStorage.getItem('picnic_cityadmin_cred');
            console.log('this is user', user);
            user = typeof user === 'string' ? JSON.parse(user) : user;
            const { title, description, to } = this.state
            // if (user.padStart.userType === 'admin') {
            const res = await axios.post(path + 'generate_notifications_park_manager', { title, description, to, userId: user.data._id })
            if (res.data.isError) {
                alert(res.data.message)
            }
            this.setState({
                title: '',
                description: '',
                to: 'all'
            })
            // }
        } catch (err) {
            console.log('this is the error', err)
            alert('error comes in sending notification')
        }

    }
    render() {
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
                                                                    this.state.title
                                                                        ? this.state.title
                                                                        : ""
                                                                }
                                                                placeholder="Enter Title"
                                                                onChange={event => this.handleChange(event)}
                                                                required
                                                            />
                                                        </Col>



                                                    </Row>
                                                    <Row>
                                                        <Col md="6">
                                                            <Label for="exampleSelect">Select</Label>
                                                            <Input type="select" name="to" id="to" onChange={this.handleChange} value={this.state.to}>
                                                                <option value="all">All</option>
                                                                <option value="users">Users</option>
                                                                <option value="city-admins">City Admins</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                    <Row style={mb20}>
                                                        <Col md="10">
                                                            <Label>Description</Label><br />
                                                            <textarea
                                                                type="text"
                                                                name="description"
                                                                value={this.state.description}
                                                                placeholder="Enter Description"
                                                                onChange={event => this.handleChange(event)}
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
                                        onClick={() => this.handleSubmit()}
                                    >
                                        Send
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