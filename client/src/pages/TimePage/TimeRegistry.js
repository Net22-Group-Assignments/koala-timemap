import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useParams, useNavigate } from "react-router-dom";
import AddProject from "./AddProject";
import AddTime from "./AddTime";

export default function TimeRegistry() {
  const [projects, setProjects] = useState();
  const [showProject, setShowProject] = useState(false);

  function toggleShowProject() {
    setShowProject(!showProject);
  }

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects);
      });
  }, []);
  function newProject(Projectname, Status, Hours, TimespanStart, TimespanEnd) {
    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        parent: {
          type: "database_id",
          database_id: "3a6e6b4bbcab4f83a66750fc4313e44c",
        },
        properties: {
          Hours: {
            number: parseInt(Hours),
          },
          Status: {
            select: {
              name: Status,
            },
          },
          Timespan: {
            date: {
              start: TimespanStart,
              end: TimespanEnd,
            },
          },
          Projectname: {
            title: [
              {
                text: {
                  content: Projectname,
                },
              },
            ],
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
        toggleShowProject();
        console.log(data);
        setProjects([...projects, data.projects]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Here is Add time-registry for timeReportsDB
  const [timeReport, setTimeReport] = useState();
  const [showTime, setShowTime] = useState(false);

  function toggleShowTime() {
    setShowTime(!showTime);
  }

  useEffect(() => {
    fetch("/api/timereports")
      .then((response) => response.json())
      .then((data) => {
        setTimeReport(data.timeReport);
      });
  }, []);
  function newTimeReport(Date, Person, Hours, Project, Note) {
    fetch("/api/timereports", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        parent: {
          type: "database_id",
          database_id: "32d3152bf0ff4036b38598308527c376",
        },
        properties: {
          Date: {
            date: {
              start: "2023-04-05",
            },
          },
          Person: {
            Relation: [
              {
                id: "245df54e41b946f8a13c142c6ee7c52f",
              },
            ],
          },
          Hours: {
            Number: 7,
          },
          Project: {
            Relation: [
              {
                id: "864ab78911db478ea72d26cb458182a1",
              },
            ],
          },
          Note: {
            Title: [
              {
                text: {
                  content: "Antecknar anteckningar",
                },
              },
            ],
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
        toggleShowTime();
        console.log(data);
        setTimeReport([...timeReport, data.timeReport]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //End of add time-registry for timeReportsDB

  return (
    <>
      <h1>Here is our projects: </h1>
      {/* <ul>
        {projects
          ? projects.map((project) => {
            return (
              <li>
                {console.log(project)}
              </li>
            );
          })
          : null}
      </ul> */}

      <AddProject
        newProject={newProject}
        showProject={showProject}
        toggleShowProject={toggleShowProject}
      />
      <AddTime
        newTimeReport={newTimeReport}
        showTime={showTime}
        toggleShowTime={toggleShowTime}
      />
    </>
  );
}
