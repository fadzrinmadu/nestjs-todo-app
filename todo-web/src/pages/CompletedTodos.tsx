import React from "react";
import { toast } from "react-toastify";

import NavBar from "../components/NavBar";
import custom_axios from "../axios/AxiosSetup";
import { getLoginInfo } from "../utils/LoginInfo";
import { ApiConstants } from "../api/ApiConstants";
import CompletedTodoList from "../components/CompletedTodoList";

interface TodoModel {
  id: number;
  date: string;
  title: string;
}

const CompeletedTodos = () => {
  const [todos, setTodos] = React.useState<TodoModel[]>([]);

  const getAllCompletedTodos = async () => {
    const userId = getLoginInfo()?.userId;
    if (userId != null) {
      try {
        const response = await custom_axios.get(
          ApiConstants.TODO.FIND_COMPLETED(userId), 
          { 
            headers: { 
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          },
        );
        setTodos(response.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something was wrong!!");
      }
    } else {
      toast.info("Sorry you are not authenticated");
    }
  };
  
  const deleteTodo = async (todoId: number) => {
    try {
      await custom_axios.delete(
        ApiConstants.TODO.DELETE(todoId), { 
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      
      getAllCompletedTodos();
      toast.success("Todo Deleted Sucessfully!!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something was wrong!!");
    }
  };

  React.useEffect(() => {
    if (todos.length == 0) getAllCompletedTodos();
  }, []);

  return (
    <div>
      <NavBar></NavBar>
      <div className="container bg-white mt-8 py-8 rounded-2xl flex mx-auto w-full items-center justify-center">
        <ul className="flex gap-y-4 flex-col p-4">
          <div className="flex gap-x-4 mb-2">
            <h1 className="font-medium text-2xl">Completed Todos : </h1>
          </div>
          
          {todos.map((todo) => (
            <CompletedTodoList
              id={todo.id}
              key={todo.id}
              todo={todo.title}
              dateTime={todo.date}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompeletedTodos;
