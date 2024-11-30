import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AppInput from "../components/input";
import { getAppointmentsAPI } from "../utils/apis";
import { notification } from 'antd';
import { format } from 'date-fns';
import Navbar from "./navbar";
import UserNav from "./usernav";
import { getPDFAPI } from "../utils/apis";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";

const ReportsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedDay, setSelectedDay] = useState("Today"); // Initialize with a default value
    const currentDate = new Date();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        const filteredData = searchTerm
            ? tickets.filter(ticket => ticket.userlinkid.phone === searchTerm)
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
                <td>{ticket.createdDate || '-'}</td>
                <td>{ticket.userlinkid.firstName+" "+ticket.userlinkid.lastName}</td>
                <td>{ticket.userlinkid.phone || '-'}</td>
                <td>{ticket.userlinkid.aadharId || '-'}</td>
                <td>{ticket.userlinkid.village || '-'}</td>
                <td>{ticket.userlinkid.ConstituencywithVoteId || '-'}</td>
                <td>{ticket.vistCount || '-'}</td>
                <td>{ticket.natureofWork || '-'}</td>
                <td>{ticket.priortyofVisit || '-'}</td>
                <td>{ticket.visitPurpose || '-'}</td>
                <td>{ticket.aptStatus || '-'}</td>
                <td>{ticket.followupDate || '-'}</td>
                <td>{ticket.followupComments || '-'}</td>
            </tr>
        ));
    };

    useEffect(() => {
        getAppointments(page);
    }, []);

    const getAppointments = async (page) => {
        try {
          document.body.classList.add("loading-indicator");
          const { data } = await getAppointmentsAPI();
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
    const filterData = (data, fromDate, toDate, dateField, aptStatus) => {
        let filteredData = [...data]; // Create a copy of the original data
    
        if (fromDate && toDate) {
            // If both fromDate and toDate are provided, filter by date range
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item[dateField]);
                return itemDate >= fromDateObj && itemDate <= toDateObj;
            });
        } else if (aptStatus) {
            // If aptStatus is provided, filter by aptStatus
            filteredData = filteredData.filter(item => item.aptStatus === aptStatus);
        }
        return filteredData;
    };
    const getFilteredRecordsCount = () => {
        return filteredTickets.length;
    };
    const getFilteredRecordsPercentage = () => {
        const filteredPercentage = (filteredTickets.length / totalRecordsCount) * 100;
        if (isNaN(filteredPercentage)) {
            return "0%";
        }
        return filteredPercentage.toFixed(2) + "%";
    };
    const appointmentreportssearch = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const payload = new FormData(document.getElementById('myForm'));
            const fromDate = payload.get('fromDate');
            const toDate = payload.get('toDate');
            const aptStatus = payload.get('aptStatus');
            
            if (fromDate && toDate || aptStatus) {
                // If both fromDate and toDate are provided, filter the data
                const { data } = await getAppointmentsAPI({
                    selectedDay,
                    searchTerm
                });
                if (data.status === true) {
                    const filteredData = filterData(data.data, fromDate, toDate, 'createdDate', aptStatus);
                    setTickets(filteredData);
                    if (filteredData.length === 0) {
                        notification.warning({
                            description: "No results found.",
                            placement: "topRight"
                        });
                    } else {
                        setTickets(filteredData);
                        notification.success({
                            description: "Data fetched successfully",
                            placement: "topRight"
                        });
                    }
                } else {
                    notification.error({
                        description: data.message,
                        placement: "bottomRight"
                    });
                }
            } else {
                // If fromDate or toDate is not provided, fetch all data
                const { data } = await getAppointmentsAPI({
                    selectedDay,
                    searchTerm
                });
                if (data.status === true) {
                    setTickets(data.data);
                } else {
                    notification.error({
                        description: data.message,
                        placement: "bottomRight"
                    });
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

    const downloadExcel = async () => {
        try {
            if (tickets.length === 0) {
                // If tickets array is empty, do not proceed with download
                notification.warning({
                    description: "No data available to download",
                    placement: "bottomRight"
                });
                return;
            }
            document.body.classList.add("loading-indicator");
            // Gather the data from tickets state variable
            const dataToDownload = tickets.map(ticket => ({
                'Booking Date': ticket.createdDate || '-',
                'Full Name': ticket.userlinkid.firstName + " " + ticket.userlinkid.lastName,
                'Phone Number': ticket.userlinkid.phone || '-',
                'Adhaar': ticket.userlinkid.aadharId || '-',
                'Village': ticket.userlinkid.village || '-',
                'Constituency': ticket.userlinkid.ConstituencywithVoteId || '-',
                'No of Visitors': ticket.vistCount || '-',
                'Nature/Type of Work': ticket.natureofWork || '-',
                'Priority Of Visit': ticket.priortyofVisit || '-',
                'Purpose Of Visit': ticket.visitPurpose || '-',
                'Status Of Ticket': ticket.aptStatus || '-',
                'Follow Up Date': ticket.followupDate == "" || ticket.followupDate == null ? "" : format(Date(ticket.followupDate), 'yyyy-MM-dd'),
                'Follow Up Comments': ticket.followupComments || '-'
            }));
    
            // Convert data to XLSX format
            const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointment Reports');
    
            // Convert the workbook to a binary XLSX file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            // Create a Blob from the Excel data
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            // Save the Blob as a file using FileSaver.js
            saveAs(blob, 'appointment_reports.xlsx');
    
            document.body.classList.remove("loading-indicator");
            notification.success({
                description: "Report downloaded successfully",
                placement: "topRight"
            });
        } catch (e) {
            document.body.classList.remove("loading-indicator");
            notification.error({
                description: "Something went wrong",
                placement: "bottomRight"
            });
        }
    };
    const startDate = (event) => {
        const selectedDate = event.target.value;
        if (toDate && new Date(selectedDate) > new Date(toDate)) {
            alert('From Date cannot be greater than To Date');
            setFromDate('');
        } else {
            setFromDate(selectedDate);
        }
    };

    const endDate = (event) => {
        const selectedDate = event.target.value;
        if (fromDate && new Date(selectedDate) < new Date(fromDate)) {
            alert('To Date cannot be less than From Date');
            setToDate('');
        } else {
            setToDate(selectedDate);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <>
            <div id="wrapper">
                <Navbar></Navbar>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                                <i class="fa fa-bars"></i>
                            </button>
                            <UserNav></UserNav>
                        </nav>
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Appointment Reports</h1>
                                <a href="#" id="exportButton" className="btn btn-sm btn-primary shadow-sm" onClick={downloadExcel}><i
                                    className="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
                            </div>
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <form id="myForm" onSubmit={e => e.preventDefault()}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-1 text-right pr-md-0">
                                                <div className="form-group">
                                                    <label for="from" className="mb-0 mt-2">From :</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pr-md-0">
                                                <div className="form-group">
                                                    <div className="inner-addon ">
                                                        <input
                                                            type="date"
                                                            id="fromDate"
                                                            name="fromDate"
                                                            className="form-control"
                                                            value={fromDate}
                                                            onChange={startDate}
                                                            max={getCurrentDate()}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-1 text-right">
                                                <div className="form-group">
                                                    <label for="to" className="mb-0 mt-2">To :</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pl-md-0">
                                                <div className="form-group">
                                                    <div className="inner-addon ">
                                                        <input
                                                            type="date"
                                                            id="toDate"
                                                            name="toDate"
                                                            className="form-control"
                                                            value={toDate}
                                                            onChange={endDate}
                                                            min={fromDate ? formatDate(fromDate) : undefined}
                                                            max={getCurrentDate()}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-1 text-center">
                                                <div className="form-group">
                                                    <label for="to" className="mb-0 mt-2 text-danger">or</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <select id="" class="custom-select" name="aptStatus">
                                                    <option selected disabled>Search ticket Status</option>
                                                    <option value="">All tickets</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="On Hold">On Hold</option>
                                                    <option value="Follow Up Required">Follow Up Required</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="In Progress">In Progress</option>
                                                </select>
                                            </div>
                                            <div className="col-md-1">
                                                <button type="submit" className="btn btn-primary mb-3" onClick={appointmentreportssearch}>Search</button>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover" id="dataTable" width="100%">
                                            <thead>
                                                <tr>
                                                    <th style={{ minWidth: '150px' }}>Booking Date</th>
                                                    <th style={{ minWidth: '200px' }}>Full Name</th>
                                                    <th style={{ minWidth: '150px' }}>Phone Number</th>
                                                    <th>Adhaar</th>
                                                    <th>Village</th>
                                                    <th>Constituency</th>
                                                    <th style={{ minWidth: '135px' }} title="No of Visitors Accompanied">No of Visitors</th>
                                                    <th style={{ minWidth: '190px' }}>Nature/Type of Work</th>
                                                    <th style={{ minWidth: '150px' }}>Priority Of Visit</th>
                                                    <th style={{ minWidth: '150px' }}>Purpose Of Visit</th>
                                                    <th style={{ minWidth: '150px' }}>Status Of Ticket</th>
                                                    <th style={{ minWidth: '150px' }}>Follow Up Date</th>
                                                    <th style={{ minWidth: '190px' }}>Follow Up Comments</th>
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
                                                <span className="ml-3">Filtered Appointments: <b>{getFilteredRecordsCount()}</b></span>
                                                <span className="ml-3">Appointments Percentage: <b>{getFilteredRecordsPercentage()}</b></span>
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
export default ReportsPage;