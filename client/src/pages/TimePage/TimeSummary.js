import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import EditProject from "./EditProject";
import CheckProjectStatus from "../../components/RadioButtons";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import timesumsCss from "./TimeSummary.css";
import AddProject from "./AddProject";
import AddTime from "./AddTime";
import useAxios from "axios-hooks";
import { useTreasure } from "react-treasure";
import useLocalStorage from "use-local-storage";

export default function TimeSummary(props) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const [projectStorage, setProjectStorage] = useLocalStorage("projects", []);
  const [peopleStorage, setPeopleStorage] = useLocalStorage("people", []);
  const [timeStorage, setTimeStorage] = useLocalStorage("timereports", []);

  const [showEditProject, setShowEditProject] = useState(false);
  const [SelectedRadioBtn, setSelectedRadioBtn] = useState("All");

  const [projects, setProjects] = useState(
    projectStorage.length > 0 ? projectStorage : []
  );
  const [peopleData, setPeopleData] = useState(
    peopleStorage.length > 0 ? peopleStorage : []
  );
  const [timeData, setTimeData] = useState(
    timeStorage.length > 0 ? timeStorage : []
  );

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Use axios hooks to fetch data from the API
  const [
    {
      data: getProjectData,
      loading: getProjectLoading,
      error: getProjectError,
    },
    executeGetProjects,
  ] = useAxios("/api/projects", { headers: { Authorization: authHeader() } });

  const [
    { data: getPeopleData, loading: getPeopleLoading, error: getPeopleError },
    executeGetPeople,
  ] = useAxios("/api/people", { headers: { Authorization: authHeader() } });

  const [
    {
      data: getTimeReportData,
      loading: getTimeReportLoading,
      error: getTimeReportError,
    },
    executeGetTimeReportData,
  ] = useAxios("/api/timereports?collated=true", {
    headers: { Authorization: authHeader() },
  });

  const [
    {
      data: postProjectData,
      loading: postProjectLoading,
      error: postProjectError,
    },
    executePostProject,
  ] = useAxios(
    {
      url: "/api/projects",
      method: "POST",
      headers: { Authorization: authHeader() },
    },
    { manual: true }
  );

  const [
    {
      data: patchProjectData,
      loading: patchProjectLoading,
      error: patchProjectError,
    },
    executePatchProject,
  ] = useAxios(
    {
      url: "/api/projects",
      method: "PATCH",
      headers: { Authorization: authHeader() },
    },
    { manual: true }
  );

  const [
    {
      data: postTimeReportData,
      loading: postTimeReportLoading,
      error: postTimeReportError,
    },
    executePostTimeReport,
  ] = useAxios(
    {
      url: "/api/timereports",
      method: "POST",
      headers: { Authorization: authHeader() },
    },
    { manual: true }
  );

  // Functions to toggle modals
  function toggleShowEditProject() {
    setShowEditProject(!showEditProject);
  }

  function toggleShowProjectModal() {
    setShowProjectModal(!showProjectModal);
  }

  function toggleShowTimeModal() {
    setShowTimeModal(!showTimeModal);
  }

  // Functions to handle data from child components
  async function addProject(newProjectData) {
    await executePostProject({
      data: {
        properties: newProjectData.properties,
      },
    });
  }
  async function updateProjects(updatedProjectData) {
    await executePatchProject({
      data: {
        page_id: updatedProjectData.page_id,
        body_params: { properties: updatedProjectData.properties },
      },
    });
  }

  async function addTimeReport(newTimeReportData) {
    await executePostTimeReport({
      data: {
        properties: newTimeReportData.properties,
      },
    });
    await executeGetProjects();
    await executeGetPeople();
  }

  //useEffect(() => {}, []);

  useEffect(() => {
    if (getProjectData) {
      setProjects(getProjectData.results);
      setProjectStorage(getProjectData.results);
    }
  }, [getProjectData]);

  useEffect(() => {
    if (getPeopleData) {
      setPeopleData(getPeopleData.results);
      setPeopleStorage(getPeopleData.results);
    }
  }, [getPeopleData]);

  useEffect(() => {
    if (getTimeReportData) {
      setTimeData(getTimeReportData.results);
      setTimeStorage(getTimeReportData.results);
    }
  }, [getTimeReportData]);

  useEffect(() => {
    if (postProjectData) {
      const sortedProjects = sortKoalaObjectsByDate(
        [...projects, postProjectData],
        "Timespan"
      );
      setProjects(sortedProjects);
      setProjectStorage(sortedProjects);
    }
  }, [postProjectData]);

  useEffect(() => {
    if (patchProjectData) {
      const patchedProjects = projects.map((project) =>
        project.id === patchProjectData.id
          ? { ...project, ...patchProjectData }
          : project
      );
      const sortedPatchedProjects = sortKoalaObjectsByDate(
        patchedProjects,
        "Timespan"
      );
      setProjects(sortedPatchedProjects);
      setProjectStorage(sortedPatchedProjects);
    }
  }, [patchProjectData]);

  useEffect(() => {
    if (postTimeReportData) {
      const updatedTimeData = sortKoalaObjectsByDate(
        [...timeData, postTimeReportData],
        "Date"
      );
      setTimeData(updatedTimeData);
      setTimeStorage(updatedTimeData);
    }
  }, [postTimeReportData]);

  let timeProject = "";

  const sortKoalaObjectsByDate = (koalaObjects, datePropertyName) => {
    // Sort array by Timespan.date.start
    return [...koalaObjects].sort((a, b) => {
      const aDate = new Date(a.properties[datePropertyName].date.start);
      const bDate = new Date(b.properties[datePropertyName].date.start);
      // sort by date descending
      return bDate - aDate;
    });
  };

  const getFilteredProjects = () => {
    if (timeData && projects) {
      if (auth().person.role !== "User") {
        return projects;
      }
      const filteredTimeData = timeData.filter(
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
      <div container className="RadioBtn_container">
        <div className="flex justify-content: flex-end">
        <div className="mx-10 my-2">
          <CheckProjectStatus setSelectedRadioBtn={setSelectedRadioBtn} />
          <p>{SelectedRadioBtn}</p>
        </div>
          <div className="mx-10" id="btn_styles">
          <EditProject
              showEditProject={showEditProject}
              toggleShowEditProject={toggleShowEditProject}
              projects={projects}
              updateProjects={updateProjects}
            />

            <AddProject
              addProject={addProject}
            showProject={showProjectModal}
            toggleShowProject={toggleShowProjectModal}
            />
            <AddTime
              addTimeReport={addTimeReport}
              showTime={showTimeModal}
              toggleShowTime={toggleShowTimeModal}
              projects={projects}
              //timeReports={timeData}
              //updateTimeReports={setTimeData}
          /></div>
        </div>
      </div>
      {/* Here is display for projects DB */}
      <div className="project_container_container">
        <p>Project</p>
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
                .filter(
                  (status) =>
                    status.properties.Status.select.name === SelectedRadioBtn ||
                    SelectedRadioBtn === "All"
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
      </div>
      {/* Here is the display for People DB */}
      <div className="people_container_container">
        <p>People Timereport</p>
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
              ? peopleData.map((people) => (
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
      {/* Here is the display for TimeProject DB */}
      <div className="timereport_container_container">
        <p>TimeReport</p>
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
              ? timeData.map((time) => (
                  <tbody>
                  <tr>
                    <td>{time.properties.Date.date.start}</td>
                    <td>
                      {Array.isArray(
                          time.properties.Person.relation_properties.Name.title
                      )
                          ? time.properties.Person.relation_properties.Name
                              .title[0].text.content
                          : time.properties.Person.relation_properties.Name.title
                              .text.content}
                    </td>
                    <td>{time.properties.Hours.number}</td>
                    <td>
                      {Array.isArray(
                          time.properties.Project.relation_properties.Projectname
                              .title
                      )
                          ? time.properties.Project.relation_properties
                              .Projectname.title[0].text.content
                          : time.properties.Project.relation_properties
                              .Projectname.title.text.content}
                    </td>
                    <td>
                      {time.properties.Note.title.length > 0 &&
                          time.properties.Note.title[0].text.content}
                    </td>
                  </tr>
                  </tbody>
              ))
            : null}
        </Table>
      </div>
    </div>
    </div>
  );
}
