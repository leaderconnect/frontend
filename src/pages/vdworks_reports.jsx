import { Link, } from "react-router-dom";
import { getvillagedevelopmentAPI } from "../utils/apis";
import { notification } from 'antd';
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import UserNav from "./usernav";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";

const VillageDevelopmentWorksReportsPage = () => {
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const currentDate = new Date();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [villageSearchTerm, setVillageSearchTerm] = useState("");

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        const filteredData = searchTerm
            ? tickets.filter(ticket => ticket.userlinkid.phone === searchTerm)
            : tickets;
        
        const furtherFilteredData = villageSearchTerm
            ? filteredData.filter(ticket => ticket.village.toLowerCase().includes(villageSearchTerm.toLowerCase()))
            : filteredData;

        setFilteredTickets(furtherFilteredData);
        setCurrentPage(0); // Reset to the first page when search term changes
    }, [searchTerm, villageSearchTerm, tickets]);

    const renderTickets = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        if (filteredTickets.length === 0) {
            return (
                <tr>
                    <td colSpan="19">No data available</td>
                </tr>
            );
        }
        return filteredTickets.slice(startIndex, endIndex).map(ticket => (
            <tr key={ticket._id}>
                <td>{ticket.date}</td>
                <td>{ticket.mandal}</td>
                <td>{ticket.village}</td>
                <td>{ticket.address}</td>
                <td>{ticket.stateOrCentralSchemaL}</td>
                <td>{ticket.departmentOfWork}</td>
                <td>{ticket.workType}</td>
                <td>{ticket.workDesc}</td>
                <td>{ticket.inchargeofWork}</td>
                <td>{ticket.inchargePhone}</td>
                <td>{ticket.workStatus}</td>
                <td>{ticket.workStartDate}</td>
                <td>{ticket.workEndDate}</td>
                <td>{ticket.amountStatus}</td>
                <td>{ticket.amountSpent}</td>
                <td>{ticket.amountSanction}</td>
                <td>{ticket.amountApproved}</td>
                <td>{ticket.stateContribution}</td>
                <td>{ticket.centralContribution}</td>
            </tr>
        ));
    };

    useEffect(() => {
        villagdevelopmentworksreports(page);
    }, [page]);

    const filterByDateRange = (data, fromDate, toDate) => {
        // Convert fromDate and toDate strings to Date objects
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        
        // Filter the data based on the date range
        const filteredData = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= fromDateObj && itemDate <= toDateObj;
        });
        
        return filteredData;
    };
    const villagdevelopmentworkssearch = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const payload = new FormData(document.getElementById('myForm'));
            const fromDate = payload.get('fromDate');
            const toDate = payload.get('toDate');
            const villageSearch = payload.get('villagesearch');
            
            let responseData;
            if (fromDate && toDate) {
                // If both fromDate and toDate are provided, filter the data
                const { data } = await getvillagedevelopmentAPI();
                if (data.status === true) {
                    const filteredData = filterByDateRange(data.data, fromDate, toDate);
                    responseData = filteredData;
                    if (filteredData.length === 0) {
                        setTotalRecordsCount(filteredData.length);
                        notification.warning({
                            description: "No results found.",
                            placement: "topRight"
                        });
                    }else {
                        setTotalRecordsCount(filteredData.length);
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
                const { data } = await getvillagedevelopmentAPI();
                if (data.status === true) {
                    responseData = data.data;
                    setTotalRecordsCount(data.data.length);
                } else {
                    notification.error({
                        description: data.message,
                        placement: "bottomRight"
                    });
                }
            }
            if (responseData) {
                setTickets(responseData);
            }
            if (villageSearch) {
                setVillageSearchTerm(villageSearch); // Set the village search term in state
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

    const villagdevelopmentworksreports = async (page) => {
        try {
            document.body.classList.add("loading-indicator");
            const offset = (page - 1) * 10;
            const { data } = await getvillagedevelopmentAPI({ offset, limit: 10 });

            if (data.status === true) {
                setTotalRecordsCount(data.data.length);
                setTickets(data.data);
                document.body.classList.remove("loading-indicator");
            }
            else{
                document.body.classList.remove("loading-indicator");
            }
        } catch (e) { 
            document.body.classList.remove("loading-indicator");
         }
    };
    const downloadExcel = async (e) => {
        console.log(e);
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
                'Date': ticket.date || '-',
                'Mandal': ticket.mandal || '-',
                'Village': ticket.village || '-',
                'City': ticket.address || '-',
                'Central/State Scheme': ticket.stateOrCentralSchemaL || '-',
                'Department Of Work': ticket.departmentOfWork || '-',
                'Work Type': ticket.workType || '-',
                'Work Description': ticket.workDesc || '-',
                'Incharge of Work': ticket.inchargeofWork || '-',
                'Incharge Phone No.': ticket.inchargePhone || '-',
                'Status of Work': ticket.workStatus || '-',
                'Work (Estimated) Start Date': ticket.workStartDate || '-',
                'Work (Estimated) End Date': ticket.workEndDate || '-',
                'Amount Status': ticket.amountStatus || '-',
                'Amount Spent': ticket.amountSpent || '-',
                'Amount Sanctioned': ticket.amountSanction || '-',
                'Amount Approved': ticket.amountApproved || '-',
                'State Govt Contribution': ticket.stateContribution || '-',
                'Central Govt Contribution': ticket.centralContribution || '-'
            }));
    
            // Convert data to XLSX format
            const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'VD Works Reports');
    
            // Convert the workbook to a binary XLSX file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            // Create a Blob from the Excel data
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            // Save the Blob as a file using FileSaver.js
            saveAs(blob, 'vdworks_reports.xlsx');
    
            document.body.classList.remove("loading-indicator");
            notification.success({
                description: "Report downloaded successfully",
                placement: "topRight"
            });
        } catch (e) {
            console.log(e);
            document.body.classList.remove("loading-indicator");
            notification.error({
                description: "Something went wrong",
                placement: "bottomRight"
            });
        }
    };
    const startDate = (event) => {
        const selectedDate = event.target.value;
        const currentDateString = currentDate.toISOString().split("T")[0];
        const endDateInput = document.getElementById("toDate");
        setFromDate(selectedDate);
        endDateInput.min = selectedDate;
        endDateInput.max = currentDateString;
        endDateInput.disabled = false;
        endDateInput.value = "";
    };

    const endDate = (event) => {
        const selectedDate = event.target.value;
        setToDate(selectedDate);
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
                                <h1 className="h3 mb-2 text-gray-800">Village Development Works Reports</h1>
                                <a href="#" id="exportButton" className="btn btn-sm btn-primary shadow-sm" onClick={downloadExcel}><i
                                    className="fas fa-download fa-sm text-white-50"></i> Download Report</a>
                            </div>
                            
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <form id="myForm" onSubmit={e => e.preventDefault()}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-2 text-right pr-md-0">
                                                <div className="form-group">
                                                    <label for="from" className="mb-0 mt-2">Search Village :</label>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <div className="inner-addon">
                                                        <input 
                                                            type="text"
                                                            id="villagesearch"
                                                            name="villagesearch"
                                                            className="form-control"
                                                            onChange={(e) => setVillageSearchTerm(e.target.value)} // Update village search term in state
                                                            placeholder="Search by Village Name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                                                            onChange={startDate}
                                                            max={currentDate.toISOString().split("T")[0]}
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
                                                            onChange={endDate}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-1">
                                                <button type="submit" className="btn btn-primary mb-3" onClick={villagdevelopmentworkssearch}>Search</button>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="table-responsive">
                                        <table id="exportTable dataTable" className="table table-bordered table-hover" width="100%" cellspacing="0">
                                            <thead className="text-center">
                                                <tr>
                                                    <th colSpan={4}></th>
                                                    <th>Central/State</th>
                                                    <th>Department</th>
                                                    <th colSpan={3}>Work</th>
                                                    <th>Incharge</th>
                                                    <th>Status</th>
                                                    <th colSpan={2}>Work (Estimated)</th>
                                                    <th colSpan={4}>Amount</th>
                                                    <th colSpan={2}>Govt Contribution</th>
                                                </tr>
                                            </thead>
                                            <thead className="text-center">
                                                <tr>
                                                    <th style={{ minWidth: '110px' }}>Date</th>
                                                    <th>Mandal</th>
                                                    <th>Village</th>
                                                    <th>City</th>
                                                    <th>Scheme</th>
                                                    <th>Of Work</th>
                                                    <th>Type</th>
                                                    <th>Description</th>
                                                    <th>Incharge</th>
                                                    <th style={{ minWidth: '110px' }}>Phone No.</th>
                                                    <th style={{ minWidth: '110px' }}>of Work</th>
                                                    <th style={{ minWidth: '110px' }}>Start Date</th>
                                                    <th style={{ minWidth: '110px' }}>End Date</th>
                                                    <th>Status</th>
                                                    <th>Spent</th>
                                                    <th>Sanctioned</th>
                                                    <th>Approved</th>
                                                    <th style={{ minWidth: '80px' }}>State</th>
                                                    <th style={{ minWidth: '80px' }}>Central</th>
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
                                                <span>Total Records: <b>{totalRecordsCount}</b></span>
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
export default VillageDevelopmentWorksReportsPage;