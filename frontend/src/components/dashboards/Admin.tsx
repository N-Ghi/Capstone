import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import { listUsers } from '../../services/userService';

const AdminDashboard: React.FC = () => {

    const [_users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await listUsers();
                console.log("Fetched users:", data);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);


    return (
        
        <div>
            <Header />
            <p>Admin Dashboard</p>
        </div>
    );
};

export default AdminDashboard;