import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import EditProject from "./EditProject";
import CheckProjectStatus from "../../components/RadioButtons";
import { useAuthHeader, useAuthUser } from "react-auth-kit";

import timesumsCss from "./TimeSummary.css";
import {
  useNewProject,
  useNewTimeReport,
  useProjectEdit,
} from "../../utilities/fetchFunctions";
import AddProject from "./AddProject";
import AddTime from "./AddTime";

export default function TimeSummary(props) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const { newTimeReport } = useNewTimeReport();
  const { ProjectEdit } = useProjectEdit();
  const { newProject } = useNewProject();
  const [editProject, setEditProject] = useState([]);
  const [showEditProject, setShowEditProject] = useState(false);
  const [SelectedRadioBtn, setSelectedRadioBtn] = useState("");
  const [projects, setProjects] = useState([]);
  const [peopleData, setPeopleData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [projectRefetch, toggleProjectRefetch] = useReducer((previousValue) => {
    return !previousValue;
  }, false);
  const [peopleRefetch, togglePeopleRefetch] = useReducer((previousValue) => {
    return !previousValue;
  }, false);
  const [timereportRefetch, toggleTimereportRefetch] = useReducer(
    (previousValue) => {
      return !previousValue;
    },
    false
  );

  function toggleShowEditProject() {
    setShowEditProject(!showEditProject);
  }

  function toggleShowProjectModal() {
    setShowProjectModal(!showProjectModal);
  }

  function toggleShowTimeModal() {
    setShowTimeModal(!showTimeModal);
  }

  function toggleAllRefetch() {
    toggleProjectRefetch();
    togglePeopleRefetch();
    toggleTimereportRefetch();
  }

  useEffect(() => {
    console.log("projectRefetch ran inside useEffect:");
    fetch("/api/projects", {
      cache: "no-cache",
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data:");
        console.log(data.results);
        setProjects(data.results);
      });
  }, [projectRefetch]);

  useEffect(() => {
    console.log("PeopleRefetch ran inside useEffect:");
    fetch("/api/people", {
      cache: "no-cache",
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => res.json())
      .then((data) => setPeopleData(data));
  }, [peopleRefetch]);

  useEffect(() => {
    console.log("TimeReportRefetch ran inside useEffect:");
    fetch("/api/timereports?collated=true", {
      cache: "no-cache",
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("timedata:");
        console.log(data);
        setTimeData(data);
      });
  }, [timereportRefetch]);

  let timeProject = "";

  const getFilteredProjects = () => {
    if (timeData && projects) {
      if (auth().person.role !== "User") {
        return projects;
      }
      const filteredTimeData = timeData.results.filter(
        (timeReport) =>
          timeReport.properties.Person.relation[0].id === auth().person.id
      );

      console.log(filteredTimeData, "filtered time data");

      const filteredProjects = projects.filter((project) => {
        return filteredTimeData.some(
          (timeReport) =>
            timeReport.properties.Project.relation[0].id === project.id
        )
          ? project
          : null;
      });

      console.log(filteredProjects, "filtered project");
      return filteredProjects;
    } else {
      return [];
    }
  };

  return (
    <div className="Table_container m-2">
      <div className="flex justify-content: flex-end">
        <div className="mx-10 my-2">
          <CheckProjectStatus setSelectedRadioBtn={setSelectedRadioBtn} />
        </div>
        <div className="mx-10">
          <EditProject
            projectEdit={ProjectEdit}
            showEditProject={showEditProject}
            toggleShowEditProject={toggleShowEditProject}
            projects={projects}
            refetch={toggleProjectRefetch}
          />
          <AddProject
            newProject={newProject}
            showProject={showProjectModal}
            toggleShowProject={toggleShowProjectModal}
            refetch={toggleProjectRefetch}
          />
          <AddTime
            newTimeReport={newTimeReport}
            showTime={showTimeModal}
            toggleShowTime={toggleShowTimeModal}
            projects={projects}
            timeReports={timeData}
            updateTimeReports={setTimeData}
            refetch={toggleTimereportRefetch}
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
              <th>Start-Date</th>
              <th>End-Date</th>
            </tr>
          </thead>
          {projects && timeData
            ? getFilteredProjects()
                .filter((status) =>
                  status.properties.Status.select.name.includes(
                    SelectedRadioBtn
                  )
                )
                .map((project) => (
                  <tbody>
                    <tr>
                      <td
                        className="project_status"
                        id={project.properties.Status.select.name}
                        style={{
                          backgroundColor:
                            project.properties.Status.select.name === "Active"
                              ? "yellow"
                              : "",
                        }}
                      >
                        {project.properties.Projectname.title[0].text.content}
                        {props.children}
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
                      <td>{project.properties.Timespan.date.end}</td>
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
