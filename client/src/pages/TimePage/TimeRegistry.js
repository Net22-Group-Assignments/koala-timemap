import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useParams, useNavigate } from "react-router-dom";
import AddProject from "./AddProject";

export default function TimeRegistry() {
  const [projects, setProjects] = useState();
  const [show, setShow] = useState(false);

  function toggleShow() {
    setShow(!show);
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
        toggleShow();
        console.log(data);
        setProjects([...projects, data.projects]);
      })
      .catch((e) => {
        console.log(e);
      });
  }
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
      <AddProject newProject={newProject} show={show} toggleShow={toggleShow} />
    </>
  );
}
