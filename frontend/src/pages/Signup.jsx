import React, { useState } from "react";
import { Heading } from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";

const Signup = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/signup",
        {
          username,
          password,
          firstName,
          lastName,
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        setUserName("");
        setPassword("");
        setFirstName("");
        setLastName("");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="John"
            type={"text"}
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Doe"
            type={"text"}
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="harkirat@gmail.com"
            type={"text"}
            label={"Username"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            type={"password"}
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={() => {
                handleSubmit();
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
