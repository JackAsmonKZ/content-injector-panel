import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import CampaignDetails from "./pages/CampaignDetails/CampaignDetails";
import AppLayout from "./components/AppLayout";
import Instruction from "./pages/Instruction/Instruction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Instruction />
            </AppLayout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <AppLayout>
              <CampaignDetails />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
