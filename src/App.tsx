import React from "react";
import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

interface IUser {
  id: string;
  userName: string;
}

function App() {
  const [usersArr, setUsersArr] = useState<IUser[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("http://localhost:3000/users").then(function (response) {
        console.log("tu ma byc response", response.data);
        setUsersArr(response.data);
      });
    };
    fetchData();
  }, []);

  const addUser = async () => {
    try {
      await axios.post(`http://localhost:3000/users`, {
        userName: newUserName,
      });

      const response = await axios.get("http://localhost:3000/users");
      setUsersArr(response.data);
      setNewUserName("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);

      const response = await axios.get("http://localhost:3000/users");
      setUsersArr(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const editUser = async (userId: string | null) => {
    try {
      await axios.put(`http://localhost:3000/users/${userId}`, {
        id: userId,
        userName: newUserName,
      });

      const response = await axios.get("http://localhost:3000/users");
      setUsersArr(response.data);
      setNewUserName("");
      setEditID(null);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">UserName</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {usersArr?.map((user: IUser) => {
              return (
                <tr>
                  <th scope="row">{user.id}</th>
                  <td>{user.userName}</td>
                  <td className="actionsButtons">
                    <button
                      onClick={() => {
                        setNewUserName(user.userName);
                        setIsEditing(true);
                        setEditID(user.id);
                      }}
                      className="bi bi-pencil"
                    ></button>
                    <button
                      onClick={() => {
                        deleteUser(user.id);
                      }}
                      className="bi bi-trash"
                    ></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="divForInputAndSubmitButton">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder={newUserName}
            value={newUserName}
            onChange={(e) => {
              setNewUserName(e.target.value);
            }}
          />
          <input
            className="btn btn-primary"
            type="submit"
            value="Submit"
            disabled={newUserName.length === 0}
            onClick={() => {
              isEditing ? editUser(editID) : addUser();
            }}
          ></input>
        </div>
      </header>
    </div>
  );
}

export default App;
