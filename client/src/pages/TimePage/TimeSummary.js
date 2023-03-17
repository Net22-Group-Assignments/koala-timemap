import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";

export default function TimeSummary() {
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectData(data));
  }, []);
  const [peopleData, setPeopleData] = useState(null);
  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => setPeopleData(data));
  }, []);

  return (
    <div className="Table_container">
      <div className="Project_container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Hours</th>
              <th>Worked hours</th>
              <th>Estimated hours left</th>
              <th>TimeSpan</th>
            </tr>
          </thead>
          {projectData
            ? projectData.results.map((project) => (
              <tbody>
                <tr>
                  <td>
                    {project.properties.Projectname.title[0].text.content}
                  </td>
                  <td>{project.properties.Status.select.name}</td>
                  <td>{project.properties.Hours.number}</td>
                  <td>{project.properties.HoursLeft.formula.number}</td>
                  <td>{project.properties.WorkedHours.rollup.number}</td>
                  <td>{project.properties.Timespan.date.start}</td>
                </tr>
              </tbody>
            ))
            : null}
        </Table>
      </div>
      <div className="People_container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Names</th>
              <th>Total hours worked </th>
              <th>Role</th>
            </tr>
          </thead>
          {peopleData
            ? peopleData.results.map((people) => (
              <tbody>
                <tr>
                  <td>{people.properties.Name.title[0].text.content}</td>
                  <td>{people.properties.TotalHours.rollup.number}</td>
                  <td>{people.properties.Role.select.name}</td>
                </tr>
              </tbody>
            ))
            : null}
        </Table>
      </div>
    </div>
  );
}
