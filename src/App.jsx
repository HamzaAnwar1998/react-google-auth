import { GoogleLogin } from "@react-oauth/google";
import "./App.css";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

// Helper function to set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Helper function to get a cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper function to remove a cookie
function removeCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Get current user from cookie
function getUser() {
  let user = getCookie("user");
  if (user) {
    user = JSON.parse(user);
  } else {
    user = null;
  }
  return user;
}

function App() {
  // current user
  const [currentUser, setCurrentUser] = useState(getUser());
  console.log(currentUser);

  return (
    <>
      {currentUser ? (
        <div>
          <h1>Hello, {currentUser.name}</h1>
          <p>Your email: {currentUser.email}</p>
          <div>
            <img
              src={currentUser.picture}
              alt="dp"
              width={"50px"}
              height={"50px"}
              style={{ borderRadius: "50%" }}
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              removeCookie("user");
              setCurrentUser(null);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const user = jwtDecode(credentialResponse.credential);
            setCurrentUser(user);
            setCookie("user", JSON.stringify(user), 1); // 1 days expiration
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      )}
    </>
  );
}

export default App;
