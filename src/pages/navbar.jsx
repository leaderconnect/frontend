import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { BackTop } from "antd";

const Navbar = () => {
    const userType = sessionStorage.getItem('type');

    return (
        <div>
            {userType === '1' &&
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/searchticket">
                        <div className="sidebar-brand-icon rotate-n-15" title="Leader Connect">
                            <i className="fab fa-contao"></i>
                        </div>
                        <div className="sidebar-brand-text mx-1"> Leader Connect</div>
                    </Link>
                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">
                        Appointments
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/searchticket">
                            <i className="fas fa-fw fa-search"></i>
                            <span>Search Ticket</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/registration">
                            <i className="fas fa-fw fa-user-tag"></i>
                            <span>Add Person</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/bookappointment">
                        <i class="fas fa-fw fa-calendar-check"></i>
                            <span>Book Appointment</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/appointmentstatus">
                            <i className="fas fa-fw fa-book-open"></i>
                            <span>Appointment Details</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/bookingfallowup">
                            <i className="fas fa-fw fa-book-open"></i>
                            <span>Booking Status Update</span></NavLink>
                    </li>
                    <hr class="sidebar-divider" />
                    <div class="sidebar-heading">
                        Records
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/govtbeneficiaries">
                            <i className="fas fa-fw fa-file-signature"></i>
                            <span>Govt Beneficiaries</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagedevelopmentworks">
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Development Works</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/villageleaders" exact>
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Leaders</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagevisits">
                            <i className="fas fa-fw fa-paste"></i>
                            <span>MLA Village Visits</span></NavLink>
                    </li>
                    <hr class="sidebar-divider" />
                    <div class="sidebar-heading">
                        Reports
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/reports" exact>
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Appointment Reports</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/govtbeneficiaries_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>Govt Beneficiaries Reports</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/vdworks_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>Development Works Reports</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villageleaders_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>Village Leaders Reports</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagevisit_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>MLA Village Visit Reports</span></NavLink>
                    </li>
                </ul>
            }
            {userType === '2' &&
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/searchticket">
                        <div className="sidebar-brand-icon rotate-n-15" title="Leader Connect">
                            <i className="fab fa-contao"></i>
                        </div>
                        <div className="sidebar-brand-text mx-1"> Leader Connect</div>
                    </Link>
                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">
                        Appointments
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/searchticket">
                            <i className="fas fa-fw fa-search"></i>
                            <span>Search Ticket</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/registration">
                            <i className="fas fa-fw fa-user-tag"></i>
                            <span>Add Person</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/bookappointment">
                        <i class="fas fa-fw fa-calendar-check"></i>
                            <span>Book Appointment</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/appointmentstatus">
                            <i className="fas fa-fw fa-book-open"></i>
                            <span>Appointment Details</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/bookingfallowup">
                            <i className="fas fa-fw fa-book-open"></i>
                            <span>Booking Status Update</span></NavLink>
                    </li>
                    <hr class="sidebar-divider" />
                    <div class="sidebar-heading">
                        Records
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/govtbeneficiaries">
                            <i className="fas fa-fw fa-file-signature"></i>
                            <span>Govt Beneficiaries</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagedevelopmentworks">
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Development Works</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/villageleaders" exact>
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Leaders</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagevisits">
                            <i className="fas fa-fw fa-paste"></i>
                            <span>MLA Village Visits</span></NavLink>
                    </li>
                    <hr class="sidebar-divider" />
                    <div class="sidebar-heading">
                        Reports
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/reports" exact>
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Appointment Reports</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/govtbeneficiaries_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>Govt Beneficiaries Reports</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/vdworks_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>Development Works Reports</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villageleaders_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>Village Leaders Reports</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagevisit_reports">
                            <i className="fas fa-fw fa-file-alt"></i>
                            <span>MLA Village Visit Reports</span></NavLink>
                    </li>
                </ul>
            }
            {userType === '3' &&
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/searchticket">
                        <div className="sidebar-brand-icon rotate-n-15" title="Leader Connect">
                            <i className="fab fa-contao"></i>
                        </div>
                        <div className="sidebar-brand-text mx-1"> Leader Connect</div>
                    </Link>
                    <hr className="sidebar-divider my-0" />
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/searchticket">
                            <i className="fas fa-fw fa-search"></i>
                            <span>Search Ticket</span>
                        </NavLink>
                    </li>
                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">
                        Appointments
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/registration">
                            <i className="fas fa-fw fa-user-tag"></i>
                            <span>Add Person</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/bookappointment">
                        <i class="fas fa-fw fa-calendar-check"></i>
                            <span>Book Appointment</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/appointmentstatus">
                            <i className="fas fa-fw fa-book-open"></i>
                            <span>Appointment Details</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/bookingfallowup">
                            <i className="fas fa-fw fa-book-open"></i>
                            <span>Booking Status</span></NavLink>
                    </li>
                    <hr class="sidebar-divider" />
                    <div class="sidebar-heading">
                        Records
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/govtbeneficiaries">
                            <i className="fas fa-fw fa-file-signature"></i>
                            <span>Govt Beneficiaries</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagedevelopmentworks">
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Development Works</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/villageleaders" exact>
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Leaders</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagevisits">
                            <i className="fas fa-fw fa-paste"></i>
                            <span>MLA Village Visits</span></NavLink>
                    </li>
                </ul>
            }
            {userType === '4' &&
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/searchticket">
                        <div className="sidebar-brand-icon rotate-n-15" title="Leader Connect">
                            <i className="fab fa-contao"></i>
                        </div>
                        <div className="sidebar-brand-text mx-1"> Leader Connect</div>
                    </Link>
                    <hr className="sidebar-divider my-0" />
                    <div class="sidebar-heading">
                        Records
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/govtbeneficiaries">
                            <i className="fas fa-fw fa-file-signature"></i>
                            <span>Govt Beneficiaries</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagedevelopmentworks">
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Development Works</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/villageleaders" exact>
                            <i className="fas fa-fw fa-copy"></i>
                            <span>Village Leaders</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/villagevisits">
                            <i className="fas fa-fw fa-paste"></i>
                            <span>MLA Village Visits</span></NavLink>
                    </li>
                </ul>
            }
        <BackTop className="site-back-top-basic" />
        </div>
    )
}
export default Navbar;