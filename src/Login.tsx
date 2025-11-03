import { useState } from "react";
function Login() {
  const [userLogin, setUserLogin] = useState([]);
  const [userName, setUserName] = useState("");
  const AddNewUser = () => {
    if (userName === "") {
      return;
    }

    const newUsers = {
      id: socket.id,
      text: userName,
    };
    // const saveUserName = localStorage.setItem("Users :", newUsers.text)
    setUserLogin([...userLogin, newUsers]);
    setUserName(""); //Clear the input
  };
  return (
    <div>
      {login.length}
      <br />
      {userName}
      <button onClick={AddNewUser}>Add your</button>
      <input type="text" placeholder="write something" onChange={(event) => setUserName(event.target.value)} />
    </div>
  );
}
export default Login;
