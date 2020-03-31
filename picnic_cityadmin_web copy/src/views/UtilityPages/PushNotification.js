import React, { Component, Suspense } from "react";
import { Link } from "react-router-dom";
import { AppSwitch } from "@coreui/react";
import axios from "axios";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Col,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    Table,
    Button,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import PushMessage from './PushMessage'
// import RPagination from 'react-js-pagination';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import cred from "../../cred.json";
var path = cred.API_PATH + "admin/";
var path2 = cred.API_PATH + "cityadmin/";

// var path = 'http://localhost:3132/v1/admin/';

// var path = process.env.API_PATH + "admin/";

class PushNotifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allParks: [],
            value: "",
            city_name: "",
            notifications: [],
            title: '',
            description: 'Description',
            to: 'users',
            isLoading: false
        };
        // this.handleChange = this.handleChange.bind(this);
    }

    // loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    async componentDidMount() {
        let cityAdminCity = JSON.parse(
            localStorage.getItem("picnic_cityadmin_cred")
        )["data"]["cityName"];
        const user = JSON.parse(localStorage.getItem("picnic_cityadmin_cred"));
        const data = await axios.post(path + 'get_push_notifications', { userId: user.data._id });
        console.log('this is the data of push notitfications', data)
        this.setState({ city_name: cityAdminCity, notifications: data.data.data });
    }

    // handleChange(event) {
    //     this.setState({ value: event.target.value });
    //     this.searchCityParks(event.target.value);
    // }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getAllCityParks(cityAdminCityName) {
        axios
            .post(path2 + "find_park", {
                city_name: cityAdminCityName
            })
            .then(serverResponse => {
                console.log("Response from here : ", serverResponse);
                const res = serverResponse.data;
                if (!res.isError) {
                    const allParks = res.details;
                    this.setState({ allParks });
                }
            });
    }

    searchCityParks(searchKey) {
        console.log("Hi");
        axios
            .post(path2 + "find_park", {
                search_term: searchKey,
                city_name: this.state.city_name
            })
            .then(serverResponse => {
                // console.log("Response from here : ",serverResponse)
                const res = serverResponse.data;
                if (!res.isError) {
                    const allParks = res.details;
                    this.setState({ allParks });
                }
            });
    }

    toggleSwitchHandler(parkId) {
        axios
            .post(path + "approve_park", { park_id: parkId })
            .then(serverResponse => {
                const res = serverResponse.data;
                console.log(res);
                if (res.isError) {
                    alert("Some error occured");
                }
            });
    }

    removePark(parkId) {
        axios
            .post(path2 + "remove_park", { park_id: parkId })
            .then(serverResponse => {
                const res = serverResponse.data;
                console.log(res);
                if (res.isError) {
                    alert("Some error occured");
                } else {
                    alert("Deleted Successfully");
                    this.getAllCityParks(this.state.city_name);
                }
            });
    }

    editPark(parkId) {
        this.props.history.push(`/parklist/parkdetails/${parkId}`);
    }

    handleSubmit = async () => {
        this.setState({
            isLoading: true
        })
        try {
            let user = localStorage.getItem('picnic_cityadmin_cred');
            console.log('this is user', user);
            user = typeof user === 'string' ? JSON.parse(user) : user;
            const { title, description, to } = this.state
            // if (user.padStart.userType === 'admin') {
            const res = await axios.post(path + 'generate_notifications_park_manager', { title, description, to, userId: user.data._id, cityId: user.data.cityId, cityName: user.data.cityName, user: user.data.userId })
            if (res.data.isError) {
                NotificationManager.error(res.data.message);
                return;
            }
            NotificationManager.success('Message sent successfully!')
            this.setState({
                title: '',
                description: 'Description',
                to: 'users',
                notifications: [res.data.details].concat(this.state.notifications),
                isLoading: false
            })
            // }
        } catch (err) {
            console.log('this is the error', err)
            this.setState({
                isLoading: false
            })
            alert('error comes in sending notification')
        }

    }

    render() {
        // let pavImgThumb = {
        //   width: '100%',
        //   height: '150px',
        //   objectFit: 'cover'
        // };

        let noPadding = {
            padding: "0px"
        };

        let editIconStyle = {
            float: "right",
            cursor: "pointer"
        };

        let deleteIconStyle = {
            float: "right",
            cursor: "pointer",
            marginLeft: "8px"
        };

        let availableOptions = {
            padding: "0px 8px"
        };

        return (
            <div className="animated fadeIn">
                <PushMessage {...this.state} handleChange={this.handleChange} handleSubmit={this.handleSubmit} ></PushMessage>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify" /> Notifications List

                            </CardHeader>
                            <CardBody>
                                {/* <Suspense  fallback={this.loading()}></Suspense> */}

                                {/* <FormGroup row>
                                    <Col md="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <Button type="button" color="secondary">
                                                    <i className="fa fa-search" /> Search
                        </Button>
                                            </InputGroupAddon>
                                            <Input
                                                type="text"
                                                id="input1-group2"
                                                name="input1-group2"
                                                placeholder="Search Park by name or zipcode"
                                                value={this.state.value}
                                                onChange={this.handleChange}
                                            />
                                        </InputGroup>
                                    </Col>
                                </FormGroup> */}

                                <Row>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Message Sent</th>
                                                <th>To</th>
                                                <th>Created Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.notifications.map((item, index) => {
                                                    return (
                                                        <tr key={item._id}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{item.title}</td>
                                                            <td>{item.to}</td>
                                                            <td>{item.createdAt}</td>
                                                        </tr>
                                                    )
                                                })
                                            }


                                        </tbody>
                                    </Table>


                                </Row>
                                {/* <Row>
                                    <Col sm="12" md={{ size: 8, offset: 2 }}>
                                        <RPagination
                                            ctivePage={this.state.activePage || 3}
                                            itemsCountPerPage={10}
                                            totalItemsCount={450}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                        />
                                    </Col>
                                </Row> */}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <NotificationContainer />
            </div>
        );
    }
}

export default PushNotifications;
