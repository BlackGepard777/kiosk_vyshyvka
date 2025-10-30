import './AdminPage.css' 
import { Link } from 'react-router-dom';
import { NavLink, Outlet } from "react-router";
import { AuthorizedRoute, useAuth } from "./AuthorizedRoute";


function AdminAvatar() {
  const { user } = useAuth();
  return (
    <div className="admin-avatar">
      <a href="/api/auth/logout" className="logout">
        {user?.picture ? (
          <img src={user.picture} alt={user.email || "Admin Avatar"} />
        ) : (
          <span className="default-avatar">A</span>
        )}
      </a>
    </div>
  );
}

export function AdminPage() {
    return (<AuthorizedRoute>
        <main>
            <AdminAvatar/>
            <div className="container">
                <h1>Вітаємо в адмінці</h1>                      
            </div>
        </main>
    </AuthorizedRoute>);
}

export default AdminPage;