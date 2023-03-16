import { useAuthUser, useSignIn, useSignOut } from "react-auth-kit";
import { useState } from "react";
import useAxios from "axios-hooks";
import { useNavigate } from "react-router-dom";

function Dev() {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const auth = useAuthUser();
  const [user, setUser] = useState(auth());
  const [person, setPerson] = useState(user.person);
  const [selectedPersonId, setSelectedPersonId] = useState(user.person.id);
  const [selectedRole, setSelectedRole] = useState(person.role);
  const [{ data }] = useAxios("/api/people?schema=native");

  const changePerson = (event) => {
    const personId = event.target.value;
    setSelectedPersonId(personId);
    const person = data.find((item) => item.id === personId);
    signIn({
      token: user.integration.id,
      expiresIn: 60,
      tokenType: "string",
      authState: {
        integration: user.integration,
        person: person,
      },
    });
    setPerson(person);
  };

  const changeRole = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    const personWithNewRole = person;
    personWithNewRole.role = role;
    signIn({
      token: user.integration.id,
      expiresIn: 60,
      tokenType: "string",
      authState: {
        integration: user.integration,
        person: personWithNewRole,
      },
    });
  };

  return (
    <>
      <div>
        <table className="table-auto border border-collapse">
          <thead>
            <tr>
              <th colSpan="2" className="border">
                Integration
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(user.integration).map((key) => {
              return (
                <tr>
                  <th scope="row" className="border">
                    {key}
                  </th>
                  <td className="border">{user.integration[key]}</td>
                </tr>
              );
            })}
          </tbody>
          <tbody>
            <tr>
              <th colSpan="2" className="border">
                Person
              </th>
            </tr>
            {Object.keys(person).map((key) => {
              return (
                <tr>
                  <th scope="row" className="border">
                    {key}
                  </th>
                  <td className="border">{person[key]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!!data && (
        <div>
          <select
            value={selectedPersonId}
            onChange={changePerson}
            className="border"
          >
            {data.map((person) => {
              // console.log(person);
              return <option value={person.id}>{person.name}</option>;
            })}
          </select>
        </div>
      )}
      <div>
        <select value={selectedRole} onChange={changeRole} className="border">
          {["User", "Manager", "Big Boss", "Super"].map((role) => {
            return <option value={role}>{role}</option>;
          })}
        </select>
      </div>
      <div>
        <button
          className="bg-red-600 rounded text-white p-1"
          onClick={() => {
            signOut();
            navigate("/");
          }}
        >
          Sign Out
        </button>
      </div>
    </>
  );
}

export default Dev;
