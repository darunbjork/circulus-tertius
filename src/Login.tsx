function Login({ userName, setUserLogin, setUserName, userLogin }) {
  const AddNewUser = () => {
    if (userName === "") {
      return;
    }
    const newUsers = {
      id: Date.now(),
      username: userName,
    };
    setUserLogin([...userLogin, newUsers]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Plz add your name"
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={AddNewUser}>Login</button>
      {userName}
    </div>
  );
}
export default Login;
