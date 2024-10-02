import React, { useEffect, useState } from 'react';
import TableHeader from '../../../../Components/Table/TableHeader';
import NoRecords from '../../../../Components/Table/NoRecords';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { fetchUsers, toggleUserStatus } from '../../../../api/administrator/userManagement';

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
                    <TableHeader headerContent={["NAME", "EMAIL", "PHONE", "GENDER", "ACTION"]} />
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
                                            <div
                                                className={`${user.isActive
                                                    ? 'bg-status_succes_background_green text-status_succes_text_green'
                                                    : 'bg-status_failed_text_red text-status_failed_background_red'
                                                    } rounded-md py-1 text-xs text-center pl-2 w-[70px] cursor-pointer`}
                                                onClick={() => changeUserStatus(user?._id)}
                                            >
                                                {
                                                    user.isActive
                                                        ? <div className='flex items-center gap-2'><TbLock />Lock</div>
                                                        : <div className='flex items-center gap-1'><TbLockOpen />Unlock</div>

                                                }
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4 border-b">
                                            <div className="flex space-x-2">

                                                <button
                                                    className={`${user.isActive
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : 'bg-red-500 hover:bg-red-600'
                                                        } text-white p-2 rounded`}
                                                    
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
                                        </td> */}
                                    </tr>
                                )) : (
                                    <NoRecords />
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersListPage;
