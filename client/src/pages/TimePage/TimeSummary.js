import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import EditProject from "./EditProject";
import CheckProjectStatus from "../../components/RadioButtons";

export default function TimeSummary() {
  const [editProject, setEditProject] = useState([]);
  const [showEditProject, setShowEditProject] = useState(false);
  const [checkTime, setCheckTime] = useState("lightgreen");
  const [projectStatus, setProjectStatus] = useState("");
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("Active");
  const [filteredProjects, setFilteredProjects] = useState([]);

  function toggleShowEditProject() {
    setShowEditProject(!showEditProject);
  }
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.results));
  }, []);
  const [peopleData, setPeopleData] = useState(null);
  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => setPeopleData(data));
  }, []);
  const [timeData, setTimeData] = useState(null);
  useEffect(() => {
    fetch("/api/timereports?collated=true")
      .then((res) => res.json())
      .then((data) => setTimeData(data));
  }, []);

  function projectEdit(ProjectId, Status, Hours) {
    fetch("/api/pages/" + ProjectId, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          Status: {
            select: {
              name: Status,
            },
          },
          Hours: {
            number: parseInt(Hours),
          },
        },
      }),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then((data) => {
        toggleShowEditProject();
        setEditProject([...editProject, data.results]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  let timeProject = "";

  return (
    <div className="Table_container m-2">
      <div className="flex justify-content: flex-end">
        <div className="mx-10 my-2">
          <CheckProjectStatus setSelectedRadioBtn={setSelectedRadioBtn} />
        </div>
        <div className="mx-10">
          <EditProject
            projectEdit={projectEdit}
            showEditProject={showEditProject}
            toggleShowEditProject={toggleShowEditProject}
            projects={projects}
          />
        </div>
      </div>
      {/* Here is display for projects DB */}
      <div className="Project_container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Hours</th>
              <th>Estimated hours left</th>
              <th>Worked Hours</th>
              <th>Worked Hours</th>
              <th>TimeSpan</th>
            </tr>
          </thead>
          {projects
            ? projects
                .filter((status) =>
                  status.properties.Status.select.name.includes(
                    selectedRadioBtn
                  )
                )
                .map((project) => (
                  <tbody>
                    <tr>
                      <td
                        style={{
                          backgroundColor:
                            project.properties.HoursLeft.formula.number < 0
                              ? "lightpink"
                              : "lightgreen",
                        }}
                      >
                        {project.properties.Projectname.title[0].text.content}
                      </td>
                      <td>{project.properties.Status.select.name}</td>
                      <td>{project.properties.Hours.number}</td>
                      <td
                        style={{
                          backgroundColor:
                            project.properties.HoursLeft.formula.number < 0
                              ? "lightpink"
                              : "",
                        }}
                        value={
                          project.properties.HoursLeft.formula.number < 0
                            ? (timeProject = "WARNING")
                            : (timeProject = "")
                        }
                      >
                        {project.properties.HoursLeft.formula.number}{" "}
                        {timeProject}
                      </td>
                      <td>{project.properties.WorkedHours.rollup.number}</td>
                      <td>{project.properties.Timespan.date.start}</td>
                    </tr>
                  </tbody>
                ))
            : null}
        </Table>
      </div>
      {/* Here is the display for People DB */}
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
      {/* Here is the display for TimeProject DB */}
      <div className="TimeReport_container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Person</th>
              <th>Hours</th>
              <th>Project</th>
              <th>Note</th>
            </tr>
          </thead>
          {timeData
            ? timeData.results.map((time) => (
                <tbody>
                  <tr>
                    <td>{time.properties.Date.date.start}</td>
                    <td>
                      {
                        time.properties.Person.relation_properties.Name.title[0]
                          .text.content
                      }
                    </td>
                    <td>{time.properties.Hours.number}</td>
                    <td>
                      {
                        time.properties.Project.relation_properties.Projectname
                          .title[0].text.content
                      }
                    </td>
                    <td>{time.properties.Note.title[0].text.content}</td>
                  </tr>
                </tbody>
              ))
            : null}
        </Table>
      </div>
    </div>
  );
}
