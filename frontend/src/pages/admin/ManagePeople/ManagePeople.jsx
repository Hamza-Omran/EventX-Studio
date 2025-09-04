import React, { useEffect, useState } from "react";
import Person from "@/components/Person/Person";
import api from "@/api/axiosInstance";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import "./ManagePeople.css";

const ManagePeople = () => {
    const { userInfo } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialUserSearch = params.get("userSearch") || "";
    const initialAdminSearch = params.get("adminSearch") || "";
    const [userSearch, setUserSearch] = useState(initialUserSearch);
    const [adminSearch, setAdminSearch] = useState(initialAdminSearch);
    const [usersOpen, setUsersOpen] = useState(true);
    const [adminsOpen, setAdminsOpen] = useState(true);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const res = await api.get("/optimized/people/list");
                setUsers(res.data.users);
                setAdmins(res.data.admins);
            } catch (err) {
                console.error("Error fetching optimized people data:", err);
                try {
                    const [usersRes, adminsRes] = await Promise.all([
                        api.get("/users"),
                        api.get("/admins")
                    ]);
                    setUsers(usersRes.data);
                    setAdmins(adminsRes.data);
                } catch (fallbackErr) {
                    console.error("Error with fallback people data:", fallbackErr);
                }
            }
        };
        fetchPeople();
    }, [location]);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (userSearch) params.set("userSearch", userSearch); else params.delete("userSearch");
        if (adminSearch) params.set("adminSearch", adminSearch); else params.delete("adminSearch");
        navigate({ search: params.toString() }, { replace: true });
    }, [userSearch, adminSearch]);

    const handleDelete = async (id, type) => {
        if (type === "user") {
            await api.delete(`/auth/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } else {
            await api.delete(`/admins/${id}`);
            setAdmins(admins.filter(a => a._id !== id));
        }
    };
    const handleEdit = (person, type) => {
        navigate(`/dashboard/manage-people/edit/${type}/${person._id}`, { state: { person, type } });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
    const filteredAdmins = admins.filter(a =>
        a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(adminSearch.toLowerCase())
    );

    return (
        <div className="manage-people-root">
            <div className="manage-people-section">
                <div className="manage-people-header">
                    Users
                    <span
                        className="manage-people-arrow"
                        style={{ userSelect: "none", transition: "transform 0.3s", transform: usersOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
                        onClick={() => setUsersOpen(v => !v)}
                    >
                        ▼
                    </span>
                </div>
                <input
                    className="manage-people-search"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                />
                <div
                    className="manage-people-list"
                    style={{
                        maxHeight: usersOpen ? 9999 : 0,
                        opacity: usersOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                    }}
                >
                    {filteredUsers.length === 0 ? <div className="manage-people-empty">No users found.</div> :
                        filteredUsers.map(u => (
                            <Person
                                key={u._id}
                                _id={u._id}
                                name={u.name}
                                email={u.email}
                                age={u.age}
                                gender={u.gender}
                                location={u.location}
                                interests={u.interests}
                                image={u.image}
                                onEdit={() => handleEdit(u, "user")}
                                onDelete={() => handleDelete(u._id, "user")}
                                type="user"
                                currentAdminId={userInfo?._id}
                            />
                        ))
                    }
                </div>
            </div>
            <div className="manage-people-section">
                <div className="manage-people-header">
                    Admins
                    <span
                        className="manage-people-arrow"
                        style={{ userSelect: "none", transition: "transform 0.3s", transform: adminsOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
                        onClick={() => setAdminsOpen(v => !v)}
                    >
                        ▼
                    </span>
                    <button
                        className="add-admin-btn"
                        onClick={() => navigate("/dashboard/manage-people/add-admin")}
                    >
                        Add Admin
                    </button>
                </div>
                <input
                    className="manage-people-search"
                    placeholder="Search admins by name or email..."
                    value={adminSearch}
                    onChange={e => setAdminSearch(e.target.value)}
                />
                <div
                    className="manage-people-list"
                    style={{
                        maxHeight: adminsOpen ? 9999 : 0,
                        opacity: adminsOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                    }}
                >
                    {filteredAdmins.length === 0 ? <div className="manage-people-empty">No admins found.</div> :
                        filteredAdmins.map(a => (
                            <Person
                                key={a._id}
                                _id={a._id}
                                name={a.name}
                                email={a.email}
                                age={a.age}
                                gender={a.gender}
                                location={a.location}
                                interests={a.interests}
                                image={a.image}
                                onEdit={() => handleEdit(a, "admin")}
                                onDelete={() => handleDelete(a._id, "admin")}
                                type="admin"
                                currentAdminId={userInfo?._id}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default ManagePeople;
