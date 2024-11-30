import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import HomePage from './pages/index';
import ForgotPasswordPage from "./pages/forgotPassword";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import RegistrationPage from "./pages/registration";
import SearchticketPage from "./pages/searchticket";
import BookappointmentPage from "./pages/bookappointment";
import ChangepasswordPage from "./pages/changepassword";
import ChangeuserpicPage from "./pages/changeuserpic";
import AppointmentstatusPage from "./pages/appointmentstatus";
import BookingfallowupPage from "./pages/bookingfallowup";
import ReportsPage from "./pages/reports";
import GovtBeneficiariesPage from "./pages/govtbeneficiaries";
import VillageDevelopmentWorksPage from "./pages/villagedevelopmentworks";
import VillageLeadersPage from "./pages/villageleaders";
import VillageVisitsPage from "./pages/villagevisits";
import VillageVisitPeportsPage from "./pages/villagevisit_reports";
import GovtBeneficiariesReportsPage from "./govtbeneficiaries_reports";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/searchticket" element={<SearchticketPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/bookappointment" element={<BookappointmentPage />} >
                <Route path=":userId" element={<BookappointmentPage />} />
                </Route>
                <Route path="/appointmentstatus" element={<AppointmentstatusPage />} />
                
                <Route path="/bookingfallowup" element={<BookingfallowupPage />} >
                <Route path=":ticket_id" element={<BookingfallowupPage />} />
                </Route>
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/govtbeneficiaries" element={<GovtBeneficiariesPage />} />
                <Route path="/villagedevelopmentworks" element={<VillageDevelopmentWorksPage />} />
                <Route path="/villageleaders" element={<VillageLeadersPage />} />
                <Route path="/villagevisits" element={<VillageVisitsPage />} />
                <Route path="/villagevisit_reports" element={<VillageVisitPeportsPage />} />
                <Route path="/govtbeneficiaries_reports" element={<GovtBeneficiariesReportsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/changepassword" element={<ChangepasswordPage />} />
                <Route path="/changeuserpic" element={<ChangeuserpicPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;