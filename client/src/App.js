import "./App.css";
import { useEffect, useState } from "react";
import { useAuth } from "./components/AuthProvider";

function App() {
  const { clientId, authorize, authed, user, unauthorize } = useAuth();

  useEffect(() => {
    if (!authed) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        authorize(code);
      }
    }
  });

  if (!authed)
    return (
      <div className="App">
        <a
          style={{ display: "block" }}
          href={`https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000`}
        >
          Connect to Notion
        </a>
      </div>
    );

  return <div className="App">{user}</div>;
}

export default App;
