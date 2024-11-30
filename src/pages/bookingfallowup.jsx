import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AppInput from "../components/input";
import Select, { components } from 'react-select';
import { followupApt, getAppointmentsAPI } from "../utils/apis";
import { getAppointmentsbyID } from "../utils/apis";
import { Form, notification } from 'antd';
import useForm from "../hooks/form";
import { data, event } from "jquery";
import { useParams } from 'react-router-dom';
import Navbar from "./navbar";
import UserNav from "./usernav";

const BookingfallowupPage = () => {
    const { ticket_id } = useParams()
    const [tickets, setTickets] = useState([]);
    const [followupData, setFollowupData] = useState({
        priortyofVisit: '',
        visitPurpose: '',
        aptStatus: '',
        action: '',
        followupDate: '',
        followupComments: '',
    });

    const [modifiedFields, setModifiedFields] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const getMyAppointment = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const payload = { '_id': ticket_id };
            const { data } = await getAppointmentsbyID(payload);

            if (data.status === true) {
                setTickets([data.data]);
                document.body.classList.remove("loading-indicator");
            }
            else {
                document.body.classList.remove("loading-indicator");
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
        }
    };

    useEffect(() => {
        getMyAppointment();
    }, []);

    const updateStatus = async () => {

        try {
            document.body.classList.add("loading-indicator");
            const allFieldsNull = Object.values(followupData).every(value => value === '');

            if (allFieldsNull) {
                document.body.classList.remove("loading-indicator");
                return;
            }
            // const payload = {
            //     "_id": ticket_id,
            //     "priortyofVisit": followupData.priortyofVisit,
            //     "visitPurpose": followupData.visitPurpose,
            //     "action": followupData.action,
            //     "aptStatus": followupData.aptStatus,
            //     "followupDate": followupData.followupDate,
            //     "followupComments": followupData.followupComments
            // };
            const payload = {
                "_id": ticket_id,
                ...modifiedFields
            };

            const { data } = await followupApt(payload);
            if (data.status === true) {
                document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message,
                    placement: "topRight"
                });
                setFormSubmitted(true);
            }
            else {
                document.body.classList.remove("loading-indicator");
                notification.error({
                    description: data.message,
                    placement: "topRight"
                });
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
        }
    };

    const handleInputChange = (e) => {
        if (e && e.target) {
            e.persist();
            const { name, value } = e.target;
            setFollowupData(prevState => ({
                ...prevState,
                [name]: value
            }));
            setModifiedFields(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) {
            return ''; // Return empty string if dateString is falsy
        }
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div id="wrapper">
                <Navbar></Navbar>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>
                            <UserNav></UserNav>
                        </nav>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Appointment Booking Status</h1>
                            </div>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Update Appointment Status</h6>
                                </div>
                                <div className="card-body">
                                    <div class="row justify-content-center">
                                        <div class="col-md-10">
                                            <form onSubmit={e => e.preventDefault()}>
                                                <div class="table-responsive">
                                                    <table class="table table-hover visitor-data">
                                                        {tickets.map((ticket) => (
                                                            <tbody key={ticket._id}>
                                                                <tr>
                                                                    <th>Date of Entry</th>
                                                                    <td>{ticket.createdDate || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Photo ID</th>
                                                                    <td><img src={ticket.image || '-'} style={{ maxWidth: '80px' }} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Voter ID</th>
                                                                    <td>{ticket.userlinkid.voterId || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Adhaar Card</th>
                                                                    <td>{ticket.userlinkid.aadharId || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Ration/Food Card</th>
                                                                    <td>{ticket.userlinkid.rationId || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Phone Number</th>
                                                                    <td>{ticket.userlinkid.phone || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <td>{ticket.userlinkid.firstName + ' ' + ticket.userlinkid.lastName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Address</th>
                                                                    <td>{ticket.userlinkid.address || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Constituency</th>
                                                                    <td>{ticket.userlinkid.ConstituencywithVoteId || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>No of Visitors Accompanied</th>
                                                                    <td>{ticket.vistCount || '-'}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Nature of Work/Type of Work</th>
                                                                    <td>{ticket.natureofWork}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Priority Of Visit</th>
                                                                    <td>
                                                                        <select id="" class="custom-select" name="priortyofVisit" value={followupData.priortyofVisit || ticket.priortyofVisit} onChange={handleInputChange} disabled={followupData.action === 'Cancelled' || ticket.action === 'Cancelled' || ticket.aptStatus === 'Completed' || ticket.aptStatus === 'Cancelled' || followupData.aptStatus === 'Cancelled' || followupData.aptStatus === 'Completed'}>
                                                                            <option disabled value={ticket.priortyofVisit}>{ticket.priortyofVisit}</option>
                                                                            <option value="Emergency">Emergency</option>
                                                                            <option value="Priority">Priority</option>
                                                                            <option value="Multiple Visits">Multiple Visits</option>
                                                                            <option value="General">General</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Purpose Of Visit</th>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            id="visitPurpose"
                                                                            name="visitPurpose"
                                                                            className="form-control"
                                                                            value={followupData.visitPurpose || ticket.visitPurpose}
                                                                            readOnly={followupData.action === "Cancelled" || ticket.action === 'Cancelled' || ticket.aptStatus === 'Completed' || ticket.aptStatus === 'Cancelled' || followupData.aptStatus === 'Cancelled' || followupData.aptStatus === 'Completed'}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Action</th>
                                                                    <td>
                                                                        <select id="" class="custom-select" name="action" value={followupData.action || ticket.action} disabled={ticket.action === 'Cancelled' || ticket.aptStatus === 'Completed' || ticket.aptStatus === 'Cancelled' || followupData.aptStatus === 'Completed'} onChange={handleInputChange}>
                                                                            <option disabled value={ticket.action}>{ticket.action}</option>
                                                                            <option value="Approved">Approved</option>
                                                                            <option value="Cancelled">Cancelled</option>
                                                                            <option value="On Hold">On Hold</option>
                                                                        </select>
                                                                        {/* <input
                                                                            type="text"
                                                                            id="action"
                                                                            name="action"
                                                                            className="form-control"
                                                                            value={followupData.action || ticket.action}
                                                                            onChange={handleInputChange}
                                                                        /> */}
                                                
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Status Of Ticket</th>
                                                                    <td>
                                                                        <select id="" class="custom-select" name="aptStatus" value={followupData.aptStatus || ticket.aptStatus} onChange={handleInputChange} disabled={followupData.action === "Cancelled" || ticket.action === 'Cancelled'}>
                                                                            <option disabled value={ticket.aptStatus}>{ticket.aptStatus}</option>
                                                                            <option value="Completed">Completed</option>
                                                                            <option value="On Hold">On Hold</option>
                                                                            <option value="Follow Up Required">Follow Up Required</option>
                                                                            <option value="Cancelled">Cancelled</option>
                                                                            <option value="In Progress">In Progress</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Follow Up Date</th>
                                                                    <td>
                                                                        <input type="date" id="" name="followupDate" className="form-control" 
                                                                        onChange={handleInputChange} 
                                                                        // value={followupData.followupDate || '-'}
                                                                        value={followupData.followupDate || (tickets.length > 0 ? formatDate(ticket.followupDate) : '')} 
                                                                        placeholder={ticket.followupDate} 
                                                                        min={getCurrentDate()}
                                                                        readOnly={followupData.aptStatus === "Completed" || ticket.aptStatus === 'Completed' || followupData.aptStatus==="Cancelled" || followupData.action==="Cancelled" || ticket.action === 'Cancelled' || ticket.aptStatus === 'Cancelled'}
                                                                          />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Follow Up Comments</th>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            id="followupComments"
                                                                            name="followupComments"
                                                                            className="form-control"
                                                                            value={followupData.followupComments || ticket.followupComments}
                                                                            readOnly={followupData.action === "Cancelled" || ticket.action === 'Cancelled' || ticket.aptStatus === 'Completed' || ticket.aptStatus === 'Cancelled' || followupData.aptStatus === 'Cancelled' || followupData.aptStatus === 'Completed'}
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Document</th>
                                                                    <td><Link to={ticket.docs || '/assets/img/empty-file.png'} target="_blank"><img src={ticket.docs || '/assets/img/empty-file.png'} style={{maxWidth:'80px'}}/></Link></td>
                                                                </tr>
                                                            </tbody>
                                                        ))}
                                                    </table>
                                                    {tickets.length > 0 ? (
                                                        <button type="submit" className="btn btn-primary" onClick={() => updateStatus()} disabled={formSubmitted}>Submit</button>
                                                    ) : (
                                                        <div className="text-center">
                                                            <p>No data available.</p>
                                                            <Link className="nav-link" to="/appointmentstatus">Please select an Appointment from Appointment Details</Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright &copy; Leader Connect 2022</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default BookingfallowupPage;