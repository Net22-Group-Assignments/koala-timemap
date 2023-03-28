import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useParams, useNavigate } from "react-router-dom";
import AddProject from "./AddProject";
import AddTime from "./AddTime";
import { useAuthHeader } from "react-auth-kit";

export default function TimeRegistry() {
  const authHeader = useAuthHeader();
  const [projects, setProjects] = useState([]);
  const [showProject, setShowProject] = useState(false);
  // Here is Add time-registry for timeReportsDB
  const [timeReport, setTimeReport] = useState([]);
  const [showTime, setShowTime] = useState(false);

  function toggleShowProject() {
    setShowProject(!showProject);
  }

  function toggleShowTime() {
    setShowTime(!showTime);
  }

  useEffect(() => {
    fetch("/api/projects", {
      headers: {
        Authorization: authHeader(),
        cache: "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.results);
      });
  }, []);

  useEffect(() => {
    fetch("/api/timereports", {
      headers: {
        Authorization: authHeader(),
        cache: "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeReport(data.results);
      });
  }, []);

  function newProject(Projectname, Status, Hours, TimespanStart, TimespanEnd) {
    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: authHeader(),
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
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function newTimeReport(Date, PersonId, Hours, ProjectId, Note) {
    fetch("/api/timereports", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify({
        parent: {
          type: "database_id",
          database_id: "32d3152bf0ff4036b38598308527c376",
        },
        properties: {
          Date: {
            date: {
              start: Date,
            },
          },
          Person: {
            relation: [
              {
                id: PersonId,
              },
            ],
          },
          Hours: {
            number: parseInt(Hours),
          },
          Project: {
            relation: [
              {
                id: ProjectId,
              },
            ],
          },
          Note: {
            title: [
              {
                text: {
                  content: Note,
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
        setTimeReport([...timeReport, data.results]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //End of add time-registry for timeReportsDB

  return (
    <div className="m-2">
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
        projects={projects}
      />
    </div>
  );
}
