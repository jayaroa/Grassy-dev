import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/grassy_logo.png'
import logo2 from '../../assets/img/brand/grassy_logo_small.png'
// import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
const textLogoStyle = {
  fontSize: '31px',
  margin: '2px 15px',
  fontWeight: '600',
}
class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    let isPaid =  localStorage.getItem('proFlag');
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        {/* <p style={textLogoStyle}>Grassy</p> */}
        <AppNavbarBrand
          full={{ src: logo, width: 104, height: 52, alt: 'Grassy App' }}
          minimized={{ src: logo2, width: 104, height: 52, alt: 'Grassy App' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
