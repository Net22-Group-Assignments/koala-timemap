import { useNotionStatus, useUserInfo } from "../hooks";

function Dev() {
  const { isConnected, integrationType, clientId } = useNotionStatus();
  const user = useUserInfo();

  if (!isConnected) return <div>No connection to server</div>;
  return (
    <>
      <div>Integration: {integrationType}</div>
      <div>clientId: {clientId}</div>
      <div>{JSON.stringify(user)}</div>
    </>
  );
}

export default Dev;
