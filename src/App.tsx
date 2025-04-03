import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Layout from "./pages/Header";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Reconfigure from "./pages/dashboard/Reconfigure";
import ManageInfra from "./pages/dashboard/ManageInfra";
import Topology from "./pages/wizard/Topology";
import AiToolKits from "./pages/wizard/AiToolKits";
import Models from "./pages/wizard/Models";
import Mission from "./pages/wizard/Mission";
import LlmTypes from "./pages/wizard/LlmTypes";
import Costs from "./pages/wizard/Costs";
import DashMachines from "./pages/dashboard/DashMachines";
import MachineTypes from "./pages/wizard/MachineTypes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="dashboard/dash" element={<Dashboard />} />
      <Route path="dashboard/machinetypes" element={<DashMachines />} />
      <Route path="dashboard/manageinfra" element={<ManageInfra />} />
      <Route path="dashboard/reconfigure" element={<Reconfigure />} />

      <Route path="wizard/costs" element={<Costs />} />
      <Route path="wizard/llmtypes" element={<LlmTypes />} />
      <Route path="wizard/machinetypes" element={<MachineTypes />} />
      <Route path="wizard/mission" element={<Mission />} />
      <Route path="wizard/models" element={<Models />} />
      <Route path="wizard/topology" element={<Topology />} />
      <Route path="wizard/aitoolkits" element={<AiToolKits />} />
    </Route>
  )
);

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
