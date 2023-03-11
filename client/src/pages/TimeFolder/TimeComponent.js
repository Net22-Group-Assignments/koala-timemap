import { useEffect, useState } from "react";

import "./TimeSummary.css";

function GetProject() {
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    fetch("/projects")
      .then((res) => res.json())
      .then((data) => setProjectData(data));
  }, []);

  const projectName =
    projectData &&
    projectData.results.map((project) => {
      return (
        <div>
          {project.properties.Projectname.title[0].text.content + " "}
          {project.properties.Hours.number + ""}
        </div>
      );
    });
  return projectName;
}

function GetPeople() {
  const [peopleData, setPeopleData] = useState(null);
  useEffect(() => {
    fetch("/people")
      .then((res) => res.json())
      .then((data) => setPeopleData(data));
  }, []);

  const peopleName =
    peopleData &&
    peopleData.results.map((people) => {
      return <div>{people.properties.Name.title[0].text.content}</div>;
    });
  return peopleName;
}

function GetTime() {
  const [timeData, setTimeData] = useState(null);
  useEffect(() => {
    fetch("/timereports")
      .then((res) => res.json())
      .then((data) => setTimeData(data));
  }, []);

  const timeReport =
    timeData &&
    timeData.results.map((time) => {
      return (
        <div className>
          <div>{time.properties.Date.date.start}</div>
        </div>
      );
    });
  return timeReport;
}

export { GetPeople, GetProject, GetTime };
