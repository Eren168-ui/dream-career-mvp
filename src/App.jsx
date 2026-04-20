import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DemoGalleryPage from "./pages/DemoGalleryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AssessmentPage from "./pages/AssessmentPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ResumeDiagnosisPage from "./pages/ResumeDiagnosisPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import DiagnosisReportPage from "./pages/DiagnosisReportPage.jsx";
import ConsultationPage from "./pages/ConsultationPage.jsx";
import ResumeCasesPage from "./pages/ResumeCasesPage.jsx";
import ResumeDiagnosisBridgePage from "./pages/ResumeDiagnosisBridgePage.jsx";
import StudyAbroadLandingPage from "./pages/StudyAbroadLandingPage.jsx";
import StudyAbroadProfilePage from "./pages/StudyAbroadProfilePage.jsx";
import StudyAbroadReportPage from "./pages/StudyAbroadReportPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoGalleryPage />} />
        <Route path="/start" element={<ProfilePage />} />
        <Route path="/study-abroad" element={<StudyAbroadLandingPage />} />
        <Route path="/study-abroad/start" element={<StudyAbroadProfilePage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/report" element={<ResumeDiagnosisPage />} />
        <Route path="/study-abroad/report" element={<StudyAbroadReportPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/resume-cases" element={<ResumeCasesPage />} />
        <Route path="/resume-diagnosis-bridge" element={<ResumeDiagnosisBridgePage />} />
        <Route path="/demo/:demoId/results" element={<ResultsPage />} />
        <Route path="/demo/:demoId/report" element={<DiagnosisReportPage />} />
        <Route path="/demo/:demoId" element={<Navigate to="results" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
