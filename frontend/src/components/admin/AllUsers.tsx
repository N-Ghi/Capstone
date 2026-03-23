import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import { listUsers } from '../../services/userService';
import type { AllUsersResponse } from '../../@types/auth.types';
import { PaginationControl } from '../common/PaginationControl';
import { getInitials, getAvatarColor } from '../../utils/avatar';
import styles from './AllUsers.module.css';

const ITEMS_PER_PAGE = 15;

const AllusersComponent: React.FC = () => {
    const [users, setUsers] = useState<AllUsersResponse['results']>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await listUsers();
                setUsers(data.results);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className={styles.allusersPage}>
            <Header />
            <main className={styles.allusersMain}>
                <div className={styles.allusersHeader}>
                    <h1 className={styles.allusersTitle}>All Users</h1>
                    <span className={styles.allusersCount}>{users.length} members</span>
                </div>

                {loading && (
                    <div className={styles.allusersState}>
                        <div className={styles.allusersSpinner} />
                        <p>Loading users...</p>
                    </div>
                )}

                {error && (
                    <div className={`${styles.allusersState} ${styles.allusersError}`}>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className={styles.allusersGrid}>
                            {paginatedUsers.map((user) => (
                                <div key={user.id} className={styles.userCard}>
                                    <div className={styles.userCardAvatarWrap}>
                                        {user.profile_picture ? (
                                            <img
                                                src={user.profile_picture}
                                                alt={user.username}
                                                className={styles.userCardAvatar}
                                            />
                                        ) : (
                                            <div
                                                className={styles.userCardAvatarFallback}
                                                style={{ backgroundColor: getAvatarColor(user.id) }}
                                            >
                                                {getInitials(user.first_name, user.last_name, user.username)}
                                            </div>
                                        )}
                                        <span className={`${styles.userCardStatus} ${user.is_active ? styles.active : styles.inactive}`} />
                                    </div>

                                    <div className={styles.userCardInfo}>
                                        <p className={styles.userCardName}>
                                            {user.first_name && user.last_name
                                                ? `${user.first_name} ${user.last_name}`
                                                : user.username}
                                        </p>
                                        <p className={styles.userCardUsername}>@{user.username}</p>
                                        {user.email && (
                                            <p className={styles.userCardEmail}>{user.email}</p>
                                        )}
                                    </div>

                                    <span className={styles.userCardRole}>{user.role}</span>
                                </div>
                            ))}
                        </div>

                        <PaginationControl
                            currentPage={currentPage}
                            totalItems={users.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                            itemLabel="users"
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default AllusersComponent;