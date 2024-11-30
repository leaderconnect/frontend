import { Link, } from "react-router-dom";
import { getvillageleadersAPI , getPDFAPI } from "../utils/apis";
import { notification } from 'antd';
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import UserNav from "./usernav";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";

const VillageLeadersReportsPage = () => {
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
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
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        if (filteredTickets.length === 0) {
            return (
                <tr>
                    <td colSpan="10">No data available</td>
                </tr>
            );
        }
        return filteredTickets.slice(startIndex, endIndex).map(ticket => (
            <tr key={ticket._id}>
                <td>{ticket.mandal}</td>
                <td>{ticket.village}</td>
                <td>{ticket.address}</td>
                <td>{ticket.leaderName}</td>
                <td>{ticket.govtDes}</td>
                <td>{ticket.party}</td>
                <td>{ticket.partyDes}</td>
                <td>{ticket.phone}</td>
                <td>{ticket.voterId}</td>
                <td>{ticket.aadharId}</td>
                <td>{ticket.rationId}</td>
            </tr>
        ));
    };

    useEffect(() => {
        villageleadersreports(page);
    }, []);

    const villageleadersreports = async (page) => {
        try {
            document.body.classList.add("loading-indicator");
            const offset = (page - 1) * 10;
            const { data } = await getvillageleadersAPI({ offset, limit: 10 });

            if (data.status === true) {
                setTickets(data.data);
                setTotalRecordsCount(data.data.length);
                document.body.classList.remove("loading-indicator");
            }
            else{
                document.body.classList.remove("loading-indicator");
            }
        } catch (e) { 
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
                'Mandal': ticket.mandal || '-',
                'Village': ticket.village || '-',
                'Address': ticket.address || '-',
                'Leader Name': ticket.leaderName || '-',
                'Government Designation': ticket.govtDes || '-',
                'Party': ticket.party || '-',
                'Party Designation': ticket.partyDes || '-',
                'Phone Number': ticket.phone || '-',
                'Voter ID': ticket.voterId || '-',
                'Adhaar Number': ticket.aadharId || '-',
                'Ration Card Number': ticket.rationId || '-'
            }));

            // Convert data to XLSX format
            const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Village Leaders Reports');
    
            // Convert the workbook to a binary XLSX file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            // Create a Blob from the Excel data
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            // Save the Blob as a file using FileSaver.js
            saveAs(blob, 'villageleaders_reports.xlsx');
    
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
                                <h1 className="h3 mb-2 text-gray-800">Village Leaders Reports</h1>
                                <a href="#" id="exportButton" className="btn btn-sm btn-primary shadow-sm" onClick={downloadExcel}><i
                                    className="fas fa-download fa-sm text-white-50"></i> Download Report</a>
                            </div>
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table id="exportTable dataTable" className="table table-bordered table-hover" width="100%" cellspacing="0">
                                            <thead>
                                                <tr>
                                                    <th>Mandal</th>
                                                    <th>Village</th>
                                                    <th>Address</th>
                                                    <th style={{ minWidth: '120px' }}>Leader Name</th>
                                                    <th>Government Designation</th>
                                                    <th>Party</th>
                                                    <th>Party Designation</th>
                                                    <th>Phone Number</th>
                                                    <th>Voter ID</th>
                                                    <th>Aadhaar Number</th>
                                                    <th>Ration Card Number</th>
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

export default VillageLeadersReportsPage;