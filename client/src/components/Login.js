import { useAuth } from "./AuthProvider";
import { redirect } from "react-router-dom";

function Login() {
  const { authorize } = useAuth();

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  console.log(`code from params: ${code}`);
  if (code) {
    (async function () {
      await authorize();
    })();
  }
  return redirect("/start");
}

export default Login;
