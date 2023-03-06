import "./App.css";
import { useEffect, useState } from "react";
import { useAuth } from "./components/AuthProvider";

function App() {
  const { clientId, authorize, authed, user, unauthorize } = useAuth();

  useEffect(() => {
    if (!authed) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log(`code from params: ${code}`);
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
          href={`https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user`}
        >
          Connect to Notion
        </a>
      </div>
    );

  return <div className="App">{JSON.stringify(user)}</div>;
}

export default App;
