import "./App.css";
import { useEffect, useState } from "react";
import { useAuth } from "./components/AuthProvider";

function App() {
  const { authorized, user, clientId } = useAuth();

  if (!authorized)
    return (
      <div className="App">
        <a
          style={{ display: "block" }}
          href={`https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user`}
        >
          Connect to Notion
        </a>
      </div>
    );

  return (
    <div className="App">
      <p>Authorized</p>
      {JSON.stringify(user)}
    </div>
  );
}

export default App;
