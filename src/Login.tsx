import { useState } from "react";
function Login({loginRef}) {
  const {id, username} = loginRef
  

  return (
    <div>
      {username}
      {/* {id} */}
    </div>
  );
}
export default Login;
