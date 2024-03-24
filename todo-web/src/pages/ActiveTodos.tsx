import React from "react";
import { toast } from "react-toastify";

import NavBar from "../components/NavBar";
import custom_axios from "../axios/AxiosSetup";
import { getLoginInfo } from "../utils/LoginInfo";
import { ApiConstants } from "../api/ApiConstants";
import ActiveTodoList from "../components/ActiveTodoList";

interface TodoModel {
  id: number;
  date: string;
  title: string;
}

function ActiveTodos() {
  const [todos, setTodos] = React.useState<TodoModel[]>([]);
  const title: any = React.useRef();

  const getAllNotCompletedTodos = async () => {
    const userId = getLoginInfo()?.userId;
    
    if (userId != null) {
      try {
        const response = await custom_axios.get(
          ApiConstants.TODO.FIND_NOT_COMPLETED(userId), 
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

  const saveTodo = async () => {
    if (title.current.value == "") {
      toast.info("Please Provide Title");
      return;
    }
    
    const userId = getLoginInfo()?.userId;
    if (userId != null) {
      try {
        await custom_axios.post(
          ApiConstants.TODO.ADD(userId),
          {
            title: title.current.value,
          },
          { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
        );
        
        getAllNotCompletedTodos();
        title.current.value = "";
        toast.success("Todo Added Scuessfully!!");
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
        ApiConstants.TODO.DELETE(todoId), 
        { 
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token") 
          },
        },
      );
      
      getAllNotCompletedTodos();
      toast.success("Todo Deleted Sucessfully!!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something was wrong!!");
    }
  };
  
  const markCompleteTodo = async (todoId: number) => {
    try {
      await custom_axios.patch(
        ApiConstants.TODO.MARK_COMPLETE(todoId), 
        {}, 
        { 
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      
      getAllNotCompletedTodos();
      toast.success("Todo Marked Completed");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something was wrong!!");
    }
  };

  React.useEffect(() => {
    if (todos.length == 0) getAllNotCompletedTodos();
  }, []);
  
  return (
    <div>
      <NavBar></NavBar>
      <div className="container bg-white mt-8 py-8 rounded-2xl flex mx-auto w-full items-center justify-center">
        <ul className="flex gap-y-4 flex-col p-4">
          <div className="flex gap-x-4 mb-4">
            <input 
              ref={title} 
              placeholder="What will you do today?" 
              className="w-full px-4 py-4 rounded-2xl border border-[#DFEAF2]"
            />
            <button 
              onClick={saveTodo} 
              className="w-36 text-white mx-auto bg-green-400 rounded-2xl hover:bg-green-500 text-2xl"
            >
              Save
            </button>
          </div>

          {todos.map((todo) => (
            <ActiveTodoList
              id={todo.id}
              key={todo.id}
              todo={todo.title}
              dateTime={todo.date}
              deleteTodo={() => deleteTodo(todo.id)}
              markComplete={() => markCompleteTodo(todo.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ActiveTodos;
