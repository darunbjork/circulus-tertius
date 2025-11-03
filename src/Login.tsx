import { useState } from "react";
import confetti from "canvas-confetti";

function Login({ userName, setUserLogin, setUserName, userLogin }) {
  const [showBox, setShowBox] = useState(true);
  const [errorLogin, setErrorLogin] = useState(false);

  const AddNewUser = () => {
    if (userName === "") {
      setErrorLogin(!errorLogin);
      return;
    }
    const newUsers = {
      id: Date.now(),
      username: userName,
    };
    setUserLogin([...userLogin, newUsers]);
    setShowBox(!showBox);
    setErrorLogin(errorLogin);
    confetti({
      particleCount: 150,
      spread: 180
    });
  };
  return (
    <div>
      {showBox && (
        <div className="box">
          <div className="login-container">
            <div className="login">
              <h3>Välkommen till</h3>
              <p>Ciculus Tertius - skolchat</p>
              <input
                className="input-login"
                type="text"
                placeholder="Who are you?"
                onChange={(e) => setUserName(e.target.value)}
              />
              {errorLogin && <p className="error-login">Write your name!</p>}
              <button onClick={AddNewUser} className="btn-login">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;
