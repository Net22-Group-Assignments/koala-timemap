import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

export default function GetTime() {

  const [projectData, setProjectData] = useState(null);

  const fetchData = () => {
    fetch("/projects")
      .then((res) => res.json())
      .then((data) => setProjectData(data));
  };

  return (
    <div className="dataTable">
      <button onClick={fetchData}>Fetch Users</button>
      <>
        <h1>Users</h1>
        <table border={1}>
          <tr>
            <th>Projectname</th>
            <th>Hours</th>
            <th>Start date</th>
          </tr>
          {projectData ? projectData.results.map(project => (
            <tr>
              <td>{project.properties.Projectname.title[0].text.content}</td>
              <td>{project.properties.Hours.number}</td>
              <td>{project.properties.HoursLeft.formula.number}</td>
            </tr>
          ))
            : null}
        </table>
      </>
    </div>
  )
}

