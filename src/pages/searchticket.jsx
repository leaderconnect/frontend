
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointmentsAPI } from "../utils/apis";
import { notification } from 'antd';
import { format } from 'date-fns';
import Navbar from "./navbar";
import UserNav from "./usernav";
import ReactPaginate from "react-paginate";

const SearchticketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [value, setValue] = useState('');
    const [aadhaarValue, setAadhaarValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [activeInput, setActiveInput] = useState(null);

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
                    <td colSpan="8">No data available</td>
                </tr>
            );
        }
        return sortedTickets.slice(startIndex, endIndex).map(ticket => (
            <tr key={ticket._id}>
                <td>{ticket.userlinkid.firstName + " " + ticket.userlinkid.lastName}</td>
                <td>{ticket.userlinkid.phone || '-'}</td>
                <td>{ticket.natureofWork}</td>
                <td>{ticket.userlinkid.ConstituencywithVoteId}</td>
                <td>{ticket.priortyofVisit}</td>
                <td>{ticket.aptStatus}</td>
                <td>{ticket.createdDate}</td>
                <td className="table-light text-center">
                    <Link to={(`/bookingfallowup/${ticket._id}`)}><i className="fas fa-edit" title="Edit Record"></i></Link>
                    {/* <i className="fas fa-edit" title="Edit Record"></i> <i className="fas fa-trash-alt" title="Delete Record"></i> */}
                </td>
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
            setAadhaarValue(''); // Clear Aadhaar value
        } else if (name === 'aadharId') {
            setAadhaarValue(value);
            setActiveInput(value ? 'aadharId' : null); // Set Aadhaar as active input if value is not empty
            setValue(''); // Clear phone value
        }
    };
    

    useEffect(() => {
        getAppointments(page);
    }, []);

    const clearSearch = () => {
        setValue('');
        setAadhaarValue('');
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
            if ((value && !aadhaarValue)) {
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
            } else if (aadhaarValue && !value) {
                // If Aadhaar number is provided, filter the data by Aadhaar number
                const filteredAppointments = tickets.filter(appointment => {
                    return appointment.userlinkid.aadharId === aadhaarValue;
                });
                setTickets(filteredAppointments);
                if (filteredAppointments.length === 0) {
                    notification.warning({
                        description: "No data found with given Adhaar.",
                        placement: "topRight"
                    });
                } else {
                    notification.success({
                        description: "Data fetched successfully",
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
            document.body.classList.remove("loading-indicator");
          } else {
            document.body.classList.remove("loading-indicator");
          }
        } catch (e) {
          document.body.classList.remove("loading-indicator");
        }
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
                            <h1 className="h3 mb-2 text-gray-800"> Search Your Appointment</h1>
                            <p className="mb-4"></p>
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <form id="myForm" onSubmit={e => e.preventDefault()}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-2 text-right">
                                                <div className="form-group">
                                                    <label for="to" className="mb-0 mt-2">Search with Number :</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pl-md-0">
                                                <div className="form-group">
                                                    <div className="inner-addon ">
                                                        <input type="text" id="phone" name="phone" placeholder="Search with phone number" className="form-control" minLength={10} maxLength={10} value={value} onChange={handleChange} onKeyPress={(e) => handleKeyPress(e, 10)} disabled={activeInput === 'aadharId'} />
                                                        {value && (
                                                            <button type="button" className="btn btn-link" onClick={clearSearch} style={{position: 'absolute', right: '0' , top: '0'}}>
                                                                <i className="fas fa-times-circle"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 text-right">
                                                <div className="form-group">
                                                    <label for="to" className="mb-0 mt-2">Search with Adhaar :</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pl-md-0">
                                                <div className="form-group">
                                                    <div className="inner-addon ">
                                                        <input type="text" id="aadharId" name="aadharId" placeholder="Search with adhaar number" className="form-control" minLength={12} maxLength={12} value={aadhaarValue} onChange={handleChange} onKeyPress={(e) => handleKeyPress(e, 12)} disabled={activeInput === 'phone'} />
                                                        {aadhaarValue && (
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
                                                    <th>Name</th>
                                                    <th>Phone No.</th>
                                                    <th>Purpose of Work</th>
                                                    <th>Location</th>
                                                    <th>Priority</th>
                                                    <th>Status</th>
                                                    <th>Date &amp; Time</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTickets()}
                                            </tbody>
                                        </table>
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

export default SearchticketPage;