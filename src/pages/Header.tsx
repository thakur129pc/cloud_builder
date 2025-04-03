import { Outlet, Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/dashboard/dash">Dashboard</Link>
      <Link to="/dashboard/machineTypes">Machine Types</Link>
      <Link to="/dashboard/reconfigure">Reconfigure</Link>
      <Outlet />
    </div>
  );
};
export default Header;
