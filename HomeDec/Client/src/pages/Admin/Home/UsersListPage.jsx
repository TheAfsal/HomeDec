import React, { useEffect, useState } from 'react';
import { fetchUsers, toggleUserStatus } from '../../../api/userManagement';

const UsersListPage = () => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        const listUsers = async () => {
            try {
                const response = await fetchUsers();
                setUsers(response);

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        listUsers();
    }, []);

    const changeUserStatus = async (userId) => {
        try {
            await toggleUserStatus(userId)
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, isActive: !user?.isActive } : user
                )
            );
        } catch (error) {
            console.error("Error changing user status:", error);
        }
    }


    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-2 font-nunito">User Management</h1>
            <hr className='mb-5' />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg font-nunito">
                    <thead className='bg-table_header_grey'>
                        <tr >
                            <th className="py-3 border-b text-left pl-6 text-md">NAME</th>
                            <th className="py-3 border-b text-left pl-6 text-md">EMAIL</th>
                            <th className="py-3 border-b text-left pl-6 text-md">PHONE</th>
                            <th className="py-3 border-b text-left pl-6 text-md">GENDER</th>
                            <th className="py-3 border-b text-left pl-6 text-md">STATUS</th>
                            <th className="py-3 border-b text-left pl-6 text-md">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.length ?
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{`${user?.firstName} ${user?.lastName}`}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{user?.email}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{user?.phone ? user?.phone : "Not found"}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{user?.gender ? user?.phone : "Not found"}</td>
                                        <td className="px-6 py-4 border-b font-nunito ">
                                            <span
                                                className={`${user.isActive
                                                    ? 'bg-status_succes_background_green text-status_succes_text_green font-bold'
                                                    : 'bg-status_failed_text_red text-status_failed_background_red font-bold'
                                                    } rounded-md py-1 text-sm text-center inline-block min-w-[70px]`}
                                            >
                                                {user?.isActive ? "Active" : "Blocked"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b">
                                            <div className="flex space-x-2">
                                                <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12h.01M12 12h.01M9 12h.01M19 16H5a2 2 0 01-2-2V7a2 2 0 012-2h2.5M15 19H5a2 2 0 01-2-2V9a2 2 0 012-2h7a2 2 0 012 2v2.5"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    className={`${user.isActive
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : 'bg-red-500 hover:bg-red-600'
                                                        } text-white p-2 rounded`}
                                                    onClick={() => changeUserStatus(user?._id)}
                                                >
                                                    {user.isActive ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 4v16m8-8H4"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-7 text-center font-nunito text-sm">
                                            No Records Found
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersListPage;
