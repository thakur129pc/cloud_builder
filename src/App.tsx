import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './pages/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Reconfigure from './pages/dashboard/Reconfigure';
import ManageInfra from './pages/dashboard/ManageInfra';
import Topology from './pages/wizard/Topology';
import AiToolKits from './pages/wizard/AiToolKits';
import Models from './pages/wizard/Models';
import Mission from './pages/wizard/Mission';
import LlmTypes from './pages/wizard/LlmTypes';
import Costs from './pages/wizard/Costs';
import DashMachines from './pages/dashboard/DashMachines';
import MachineTypes from './pages/wizard/MachineTypes';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordRecoverNotice from './pages/auth/PasswordRecoverNotice';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProtectedRoute from './ProtectedRoute';
import CompareModels from './pages/wizard/CompareModels';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(CategoryScale);
import './assets/css/style.css';
import IndexElement from './pages/IndexElement';
import NotFound from './pages/components/NotFound';

import CertificateComp from './pages/dashboard/Certificate/Certificate';
import CertificateCreate from './pages/dashboard/Certificate/CertificateCreate';
import BaseModel from './pages/dashboard/BaseModel/BaseModel';
import BaseModelCreate from './pages/dashboard/BaseModel/BaseModelCreate';
import Inference from './pages/dashboard/Inference/Inference';
import InferenceCreate from './pages/dashboard/Inference/InferenceCreate';
import InferenceMethod from './pages/dashboard/InferenceMethod/InferenceMethod';
import InferenceMethodCreate from './pages/dashboard/InferenceMethod/InferenceMethodCreate';
import TestMachineComp from './pages/dashboard/TestMachine/TestMachine';
import TestMachineCreate from './pages/dashboard/TestMachine/TestMachineCreate';
import TaskTypeComp from './pages/dashboard/TaskType/TaskTypeComp';
import TestTypeComp from './pages/dashboard/TestType/TestTypeComp';
import ToolkitComp from './pages/dashboard/AdminTookit/ToolkitComp';
import AdminToolkitCreate from './pages/dashboard/AdminTookit/ToolkitCreate';
import TaskTypeCreate from './pages/dashboard/TaskType/TaskTypeCreate';
import BomListComp from './pages/dashboard/Bom/BomList';
import ItemList from './pages/dashboard/Items/ItemList';
import ItemCreate from './pages/dashboard/Items/ItemsCreate';
import DatasetComp from './pages/dashboard/Dataset/DatasetComp';
import DatasetCreate from './pages/dashboard/Dataset/DatasetCreate';
import TestCreate from './pages/dashboard/Test/TestCreate';
import TestComp from './pages/dashboard/Test/TestComp';
import TestTypeCreate from './pages/dashboard/TestType/TestTypeCreate';
import TaskGroupList from './pages/dashboard/TaskGroup/TaskGroupList';
import TaskList from './pages/dashboard/TaskGroup/TaskList';
import TaskGroupCreate from './pages/dashboard/TaskGroup/TaskGroupGreate';
import TaskCreate from './pages/dashboard/TaskGroup/TaskCreate';
import AppList from './pages/dashboard/Apps/AppList';
import AppCreate from './pages/dashboard/Apps/AppCreate';
import AiList from './pages/dashboard/PrivateAi/AiList';
import AiCreate from './pages/dashboard/PrivateAi/AiCreate';
// import TaskTypeCreate from './pages/dashboard/TaskType/TaskTypeCreate';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="*" element={<NotFound />} />
      <Route index element={<ProtectedRoute element={IndexElement} />} />
      <Route
        path="login"
        element={<ProtectedRoute element={Login} redirectTo="/" />}
      />
      <Route
        path="register"
        element={<ProtectedRoute element={Register} redirectTo="/" />}
      />
      <Route
        path="forgotpassword"
        element={<ProtectedRoute element={ForgotPassword} redirectTo="/" />}
      />
      <Route
        path="resetpassword"
        element={<ProtectedRoute element={ResetPassword} redirectTo="/" />}
      />
      <Route
        path="passwordrecovernotice"
        element={
          <ProtectedRoute element={PasswordRecoverNotice} redirectTo="/" />
        }
      />

      <Route
        path="dashboard"
        element={<ProtectedRoute element={Dashboard} />}
      />
      <Route
        path="basemodel"
        element={<ProtectedRoute element={BaseModel} />}
      />
      <Route
        path="basemodelcreate"
        element={<ProtectedRoute element={BaseModelCreate} />}
      />
      <Route
        path="basemodelcreate/:id"
        element={<ProtectedRoute element={BaseModelCreate} />}
      />
      <Route
        path="inference"
        element={<ProtectedRoute element={Inference} />}
      />
      <Route
        path="inferencecreate"
        element={<ProtectedRoute element={InferenceCreate} />}
      />
      <Route
        path="inferencecreate/:id"
        element={<ProtectedRoute element={InferenceCreate} />}
      />
      <Route
        path="inferencemethod"
        element={<ProtectedRoute element={InferenceMethod} />}
      />
      <Route
        path="inferencemethodcreate"
        element={<ProtectedRoute element={InferenceMethodCreate} />}
      />
      <Route
        path="inferencemethodcreate/:id"
        element={<ProtectedRoute element={InferenceMethodCreate} />}
      />

      <Route
        path="testmachine"
        element={<ProtectedRoute element={TestMachineComp} />}
      />
      <Route
        path="testmachinecreate"
        element={<ProtectedRoute element={TestMachineCreate} />}
      />
      <Route
        path="testmachinecreate/:id"
        element={<ProtectedRoute element={TestMachineCreate} />}
      />

      <Route
        path="certification"
        element={<ProtectedRoute element={CertificateComp} />}
      />
      <Route
        path="certificationcreate"
        element={<ProtectedRoute element={CertificateCreate} />}
      />
      <Route
        path="certificationcreate/:id"
        element={<ProtectedRoute element={CertificateCreate} />}
      />

      <Route
        path="tasktype"
        element={<ProtectedRoute element={TaskTypeComp} />}
      />
      <Route
        path="tasktypecreate"
        element={<ProtectedRoute element={TaskTypeCreate} />}
      />
      <Route
        path="tasktypecreate/:id"
        element={<ProtectedRoute element={TaskTypeCreate} />}
      />
      {/* Dataset */}
      <Route
        path="dataset"
        element={<ProtectedRoute element={DatasetComp} />}
      />
      <Route
        path="datasetcreate"
        element={<ProtectedRoute element={DatasetCreate} />}
      />
      <Route
        path="datasetcreate/:id"
        element={<ProtectedRoute element={DatasetCreate} />}
      />
      {/* Test */}
      <Route path="testcomp" element={<ProtectedRoute element={TestComp} />} />
      <Route
        path="testcompcreate"
        element={<ProtectedRoute element={TestCreate} />}
      />
      <Route
        path="testcompcreate/:id"
        element={<ProtectedRoute element={TestCreate} />}
      />

      <Route
        path="toolkit"
        element={<ProtectedRoute element={ToolkitComp} />}
      />
      <Route
        path="toolkitcreate"
        element={<ProtectedRoute element={AdminToolkitCreate} />}
      />
      <Route
        path="toolkitcreate/:id"
        element={<ProtectedRoute element={AdminToolkitCreate} />}
      />

      <Route
        path="testtype"
        element={<ProtectedRoute element={TestTypeComp} />}
      />
      <Route
        path="testtypecreate"
        element={<ProtectedRoute element={TestTypeCreate} />}
      />
      <Route
        path="testtypecreate/:id"
        element={<ProtectedRoute element={TestTypeCreate} />}
      />

      <Route
        path="taskgroup"
        element={<ProtectedRoute element={TaskGroupList} />}
      />
      <Route
        path="taskgroupcreate"
        element={<ProtectedRoute element={TaskGroupCreate} />}
      />
      <Route
        path="taskgroupcreate/:id"
        element={<ProtectedRoute element={TaskGroupCreate} />}
      />
      <Route path="task" element={<ProtectedRoute element={TaskList} />} />
      <Route
        path="taskcreate"
        element={<ProtectedRoute element={TaskCreate} />}
      />
      <Route
        path="taskcreate/:id"
        element={<ProtectedRoute element={TaskCreate} />}
      />

      <Route path="apps" element={<ProtectedRoute element={AppList} />} />
      <Route
        path="appscreate"
        element={<ProtectedRoute element={AppCreate} />}
      />
      <Route
        path="appscreate/:id"
        element={<ProtectedRoute element={AppCreate} />}
      />

      <Route path="ai" element={<ProtectedRoute element={AiList} />} />
      <Route path="aicreate" element={<ProtectedRoute element={AiCreate} />} />
      <Route
        path="aicreate/:id"
        element={<ProtectedRoute element={AiCreate} />}
      />

      <Route path="bom" element={<ProtectedRoute element={BomListComp} />} />
      <Route
        path="bomcreate"
        element={<ProtectedRoute element={BomListComp} />}
      />
      <Route
        path="bomcreate/:id"
        element={<ProtectedRoute element={BomListComp} />}
      />

      <Route path="items" element={<ProtectedRoute element={ItemList} />} />
      <Route
        path="itemscreate"
        element={<ProtectedRoute element={ItemCreate} />}
      />
      <Route
        path="itemscreate/:id"
        element={<ProtectedRoute element={ItemCreate} />}
      />

      <Route
        path="dashboard/machines"
        element={<ProtectedRoute element={DashMachines} />}
      />
      <Route
        path="dashboard/manageinfra"
        element={<ProtectedRoute element={ManageInfra} />}
      />
      <Route
        path="dashboard/reconfigure"
        element={<ProtectedRoute element={Reconfigure} />}
      />

      <Route path="wizard/costs" element={<ProtectedRoute element={Costs} />} />
      <Route
        path="wizard/task_types"
        element={<ProtectedRoute element={LlmTypes} />}
      />
      <Route
        path="wizard/machines"
        element={<ProtectedRoute element={MachineTypes} />}
      />
      <Route
        path="wizard/mission"
        element={<ProtectedRoute element={Mission} />}
      />
      <Route
        path="wizard/models"
        element={<ProtectedRoute element={Models} />}
      />
      <Route
        path="wizard/topology"
        element={<ProtectedRoute element={Topology} />}
      />
      <Route
        path="wizard/compare"
        element={<ProtectedRoute element={CompareModels} />}
      />
      <Route
        path="wizard/toolkit"
        element={<ProtectedRoute element={AiToolKits} />}
      />
    </Route>
  )
);

const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer />
      </Provider>
    </>
  );
};

export default App;
