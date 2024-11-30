import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const UserNav = () => {
    const handleLogout = () => {
        // Clear sessionStorage
        sessionStorage.clear();
    };
    var profilepicture = sessionStorage.getItem('image');

    return (
        <div className="ml-auto">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                            {sessionStorage.getItem('firstName')} {sessionStorage.getItem('lastName')}
                        </span>
                        <img className="img-profile rounded-circle" src={profilepicture} />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        <NavLink className="dropdown-item" activeClassName="active" exact to="/profile">
                        <i className="fas fa-user-plus fa-sm fa-fw mr-2 text-gray-400"></i>
                        <span>Edit Profile</span></NavLink>
                        <NavLink className="dropdown-item" activeClassName="active" exact to="/changeuserpic">
                        <i className="fas fa-image fa-sm fa-fw mr-2 text-gray-400"></i>
                        <span>Change Profile Picture</span></NavLink>
                        <NavLink className="dropdown-item" activeClassName="active" exact to="/changepassword">
                        <i className="fas fa-lock-open fa-sm fa-fw mr-2 text-gray-400"></i>
                        <span>Change Password</span></NavLink>
                        <div className="dropdown-divider"></div>
                        <NavLink className="dropdown-item" activeClassName="active" exact to="/login" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        <span>Logout</span></NavLink>
                        {/* <Link className="dropdown-item" data-toggle="modal" data-target="#logoutModal">
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        <span>Logout</span></Link> */}
                    </div>
                </li>
            </ul>
            {/* <a class="scroll-to-top rounded" href="#page-top"><i class="fas fa-angle-up"></i></a> */}
            <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">Select "Logout" below if you are ready to close your current session.</div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <Link class="btn btn-primary" to="/login" onClick={handleLogout}>Logout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserNav;