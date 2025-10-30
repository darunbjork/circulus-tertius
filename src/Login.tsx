import { useState } from "react"
function Login() {
  const [logins, setLogins] = useState([]);
  const [userName, setUserName] = useState("");
  const AddNewUser = () => {
    if (userName === "") {
      return;
    }
    const newId = Date.now();
    const newUsers = {
      id: newId,
      text: userName,
    };
    // const saveUserName = localStorage.setItem("Users :", newUsers.text)
    setLogins(newUsers);
    setUserName("");
  };
  return (
    <div>
      {logins.length}
      <br />
      {userName}
      <button onClick={AddNewUser}>Add Nmae</button>
      <input type="text" placeholder="write some shot" onChange={(event) => setUserName(event.target.value)}/>
    </div>
  )
}
export default Login







