import React from "react";
import { toast } from "react-toastify";

import NavBar from "../components/NavBar";
import custom_axios from "../axios/AxiosSetup";
import { getLoginInfo } from "../utils/LoginInfo";
import { ApiConstants } from "../api/ApiConstants";

interface UserModel {
  id: number;
  role: string;
  email: string;
  lastName: string;
  firstName: string;
}

const UsersPage = () => {
  const [users, setUsers] = React.useState<UserModel[]>([]);

  const getAllUsers = async () => {
    const role = getLoginInfo()?.role;
    if (role != null && role == "ADMIN") {
      try {
        const response = await custom_axios.get(
          ApiConstants.USER.FIND_ALL, { 
            headers: { 
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          },
        );
        setUsers(response.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something was wrong!!");
      }
    } else {
      toast.info("Forbidden Resource");
    }
  };
  
  const deleteUser = async (userId: number) => {
    try {
      await custom_axios.delete(
        ApiConstants.USER.DELETE(userId), 
        { 
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      getAllUsers();
      toast.success("User Deleted Sucessfully!!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something was wrong!!");
    }
  };

  React.useEffect(() => {
    if (users.length == 0) getAllUsers();
  }, []);
  
  return (
    <div>
      <NavBar></NavBar>
      <div className="container bg-white mt-8 py-8 rounded-2xl flex mx-auto w-full items-center justify-center">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-x-4 mb-4">
            <h1 className="text-2xl text-black font-medium">Users : </h1>
          </div>
          <div className="flex flex-col">
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                          First Name
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                          Last Name
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                          Email
                        </th>
                        <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                          Active
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {users.map((user) => {
                        return (
                          <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.firstName}</td>
                            <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">{user.lastName}</td>
                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.email}</td>
                            <td className="py-4 px-6 text-sm font-medium text-start whitespace-nowrap">
                              <button
                                onClick={() => deleteUser(user.id)}
                                hidden={user.role == "ADMIN" ? true : false}
                                className="bg-red-400 hover:bg-red-500 rounded-lg px-4 py-2 text-white shadow-sm text-xl "
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
