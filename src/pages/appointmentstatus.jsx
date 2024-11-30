import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AppInput from "../components/input";
import { getAppointmentsAPI } from "../utils/apis";
import { notification } from 'antd';
import { format } from 'date-fns';
import Navbar from "./navbar";
import UserNav from "./usernav";
import ReactPaginate from "react-paginate";

const AppointmentstatusPage = () => {
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [value, setValue] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [activeInput, setActiveInput] = useState(null);
    const [followupDateValue, setfollowupDateValue] = useState('');

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    useEffect(() => {
        const filteredData = searchTerm
            ? tickets.filter(ticket => ticket.userlinkid.phone === searchTerm || ticket.userlinkid.aadharId === searchTerm)
            : tickets;
        setFilteredTickets(filteredData);
        setCurrentPage(0); // Reset to the first page when search term changes
    }, [searchTerm, tickets]);

    const renderTickets = () => {
        const sortedTickets = filteredTickets.sort((a, b) => {
            const dateA = new Date(a.createdDate);
            const dateB = new Date(b.createdDate);
            return dateB - dateA;
        });
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        if (filteredTickets.length === 0) {
            return (
                <tr>
                    <td colSpan="13">No data available</td>
                </tr>
            );
        }
        return sortedTickets.slice(startIndex, endIndex).map(ticket => (
            <tr key={ticket._id}>
                <td align="center"><img src={ticket.image || '-'} style={{ maxWidth: '40px', maxHeight:'40px' }} /></td>
                <td>{ticket.userlinkid.phone || '-'}</td>
                <td>{ticket.userlinkid.firstName+" "+ticket.userlinkid.lastName}</td>
                <td>{ticket.userlinkid.ConstituencywithVoteId || '-'}</td>
                <td>{ticket.vistCount || '-'}</td>
                <td>{ticket.natureofWork || '-'}</td>
                <td>{ticket.priortyofVisit || '-'}</td>
                <td>{ticket.visitPurpose || '-'}</td>
                <td>{ticket.action || '-'}</td>
                <td><Link to={(`/bookingfallowup/${ticket._id}`)}>{ticket.aptStatus || '-'}</Link></td>
                <td>{ticket.followupDate || '-'}</td>
                {/* <td>{ticket.followupDate=="" || ticket.followupDate==null?"":format(Date(ticket.followupDate), 'yyyy-MM-dd')}</td> */}
                <td>{ticket.followupComments || '-'}</td>
                <td align="center"><Link to={ticket.docs || '/assets/img/empty-file.png'} target="_blank"><img src={ticket.docs || '/assets/img/empty-file.png'} style={{maxWidth:'40px' , maxHeight:'40px'}}/></Link></td>
            </tr>
        ));
    };
    const handleKeyPress = (e, maxLength) => {
        const keyCode = e.keyCode || e.which;
        const keyValue = String.fromCharCode(keyCode);
        const inputLength = e.target.value.length;
    
        if (inputLength >= maxLength) {
            e.preventDefault();
            notification.error({
                description: `Maximum length (${maxLength} characters) reached.`,
                placement: "topRight"
            });
        } else if (!/\d/.test(keyValue)) {
            e.preventDefault();
            notification.error({
                description: "Please enter numbers only",
                placement: "topRight"
            });
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setValue(value);
            setActiveInput(value ? 'phone' : null); // Set phone as active input if value is not empty
            setfollowupDateValue(''); // Clear Aadhaar value
        } else if (name === 'followupDate') {
            console.log('followupDate');
            setfollowupDateValue(value);
            setActiveInput(value ? 'followupDate' : null); // Set Aadhaar as active input if value is not empty
            setValue(''); // Clear phone value
            console.log(e);
        }
    };

    useEffect(() => {
        getAppointments(page);
    }, []);

    const clearSearch = () => {
        setValue('');
        setfollowupDateValue('');
        setActiveInput(null);
        getAppointments(page); // Fetch all data
    };

    // const filteredAppointments = tickets.filter(appointment => {
    //     return appointment.userlinkid.phone === searchTerm;
    // });
    
    const appointmentreportssearch = async () => {
        try {
            document.body.classList.add("loading-indicator");
            let responseData;
            if ((value && !followupDateValue)) {
                // If phone number is provided, filter the data by phone number
                const filteredAppointments = tickets.filter(appointment => {
                    return appointment.userlinkid.phone === value;
                });
                setTickets(filteredAppointments);
                if (filteredAppointments.length === 0) {
                    notification.warning({
                        description: "No data found with given phone number.",
                        placement: "topRight"
                    });
                } else {
                    notification.success({
                        description: "Data fetched successfully",
                        placement: "topRight"
                    });
                }
            } else if (followupDateValue && !value) {
                console.log(followupDateValue)
                // If Aadhaar number is provided, filter the data by Aadhaar number
                const filteredAppointments = tickets.filter(appointment => {
                    return appointment.followupDate === followupDateValue;
                });
                setTickets(filteredAppointments);
                if (filteredAppointments.length === 0) {
                    notification.warning({
                        description: "No data found with given date.",
                        placement: "topRight"
                    });
                } else {
                    notification.success({
                        description: "Data fetched successfully with Date",
                        placement: "topRight"
                    });
                }
            } else {
                // If neither phone number nor Aadhaar number is provided, fetch all data
                const { data } = await getAppointmentsAPI();
                if (data.status === true) {
                    responseData = data.data;
                } else {
                    notification.error({
                        description: data.message,
                        placement: "bottomRight"
                    });
                }
                if (responseData) {
                    setTickets(responseData);
                }
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
            notification.error({
                description: "No data fetched",
                placement: "bottomRight"
            });
        } finally {
            document.body.classList.remove("loading-indicator");
        }
    };
    
    const getAppointments = async (page) => {
        try {
          document.body.classList.add("loading-indicator");
          const { data } = await getAppointmentsAPI({
            searchTerm
          });
      
          if (data.status === true) {
            setTickets(data.data);
            setTotalRecordsCount(data.data.length);
            document.body.classList.remove("loading-indicator");
          } else {
            document.body.classList.remove("loading-indicator");
          }
        } catch (e) {
          document.body.classList.remove("loading-indicator");
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    return(
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
                                <h1 className="h3 mb-0 text-gray-800">Appointments</h1>
                            </div>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Appointments Status</h6>
                                </div>
                                <div className="card-body">
                                    <form id="myForm" onSubmit={e => e.preventDefault()}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-3 text-right">
                                                <div className="form-group">
                                                    <label for="to" className="mb-0 mt-2">Search with Contact Number :</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pl-md-0">
                                                <div className="form-group">
                                                    <div className="inner-addon ">
                                                        <input type="text" id="phone" name="phone" placeholder="Search with phone number" className="form-control" minLength={10} maxLength={10} value={value} onChange={handleChange} onKeyPress={(e) => handleKeyPress(e, 10)} disabled={activeInput === 'followupDate'} />
                                                        {value && (
                                                            <button type="button" className="btn btn-link" onClick={clearSearch} style={{position: 'absolute', right: '0' , top: '0'}}>
                                                                <i className="fas fa-times-circle"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 text-right pl-0">
                                                <div className="form-group">
                                                    <label for="to" className="mb-0 mt-2">Search by Followup Date:</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pl-md-0">
                                                <div className="form-group">
                                                    <div className="inner-addon ">
                                                        <input type="date" id="followupDate" name="followupDate" placeholder="Search with date" className="form-control" value={followupDateValue} onChange={handleChange} disabled={activeInput === 'phone'} min={getCurrentDate()} />
                                                        {followupDateValue && (
                                                            <button type="button" className="btn btn-link" onClick={clearSearch} style={{position: 'absolute', right: '0' , top: '0'}}>
                                                                <i className="fas fa-times-circle"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-1">
                                                <button type="submit" className="btn btn-primary mb-3" onClick={appointmentreportssearch}>Search</button>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
                                            <thead>
                                                <tr>
                                                    <th style={{ minWidth: '100px' }}>Photo ID</th>
                                                    <th style={{ minWidth: '150px' }}>Phone Number</th>
                                                    <th style={{ minWidth: '220px' }}>Full Name</th>
                                                    <th>Constituency</th>
                                                    <th style={{ minWidth: '135px' }} title="No of Visitors Accompanied">No of Visitors</th>
                                                    <th style={{ minWidth: '190px' }}>Nature/Type of Work</th>
                                                    <th style={{ minWidth: '150px' }}>Priority Of Visit</th>
                                                    <th style={{ minWidth: '150px' }}>Purpose Of Visit</th>
                                                    <th>Action</th>
                                                    <th style={{ minWidth: '150px' }}>Status Of Ticket</th>
                                                    <th style={{ minWidth: '150px' }}>Follow Up Date</th>
                                                    <th style={{ minWidth: '190px' }}>Follow Up Comments</th>
                                                    <th>Document</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTickets()}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-9">
                                            <div className="">
                                                <span>Total Appointments: <b>{totalRecordsCount}</b></span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="pagination-container lc-pagination">
                                                <ReactPaginate
                                                    pageCount={Math.ceil(filteredTickets.length / itemsPerPage)}
                                                    onPageChange={handlePageChange}
                                                    previousLabel={"Previous"}
                                                    nextLabel={"Next"}
                                                    containerClassName={"pagination"}
                                                    subContainerClassName={"pages pagination"}
                                                    activeClassName={"active"}
                                                />
                                            </div>
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
export default AppointmentstatusPage;