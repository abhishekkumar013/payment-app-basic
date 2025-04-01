import React, { useEffect, useState } from "react";
import axios from "axios";

import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import { Users } from "../components/Users";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState();
  const [username, setUserName] = useState("");
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const fetchBalance = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/v1/account/get-balance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    if (response.data.success) {
      setBalance(response.data.balance);
    } else {
      console.log("Error fetching balance: ", response.data.message);
    }
  };

  const fetchUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/v1/user/get-all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log(response);
    if (response.data.success) {
      setUsers(response.data.users);
    } else {
      console.log("Error fetching balance: ", response.data.message);
    }
  };

  const fetechSearchusers = async () => {
    try {
      if (!search.trim()) {
        fetchUser();
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/v1/user/search?filter=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchUser();
    const res = JSON.parse(localStorage.getItem("user"));
    setUserName(res.username);
  }, []);

  useEffect(() => {
    fetechSearchusers();
  }, [search]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
        <Users users={users} setSearch={setSearch} />
      </div>
    </div>
  );
};

export default Dashboard;
