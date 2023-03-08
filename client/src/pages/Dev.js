import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";

function Dev() {
  const { integrationType, clientId, user, authorized, unauthorize } =
    useAuth();
  const navigate = useNavigate();
  return (
    <>
      <div>Integration: {integrationType}</div>
      <div>clientId: {clientId}</div>
      <div>{JSON.stringify(user)}</div>
      {integrationType === "public" && authorized && (
        <div>
          <button
            onClick={async () => {
              unauthorize();
              navigate("/", { replace: true });
            }}
          >
            Deregister Notion Token
          </button>
        </div>
      )}
    </>
  );
}

export default Dev;
