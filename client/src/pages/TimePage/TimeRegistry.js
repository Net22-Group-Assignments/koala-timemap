import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useParams, useNavigate } from "react-router-dom";
import AddTime from './AddTime';

export default function TimeRegistry() {

  const [projects, setProjects] = useState();
  const [show, setShow] = useState(false);

  function toggleShow() {
    setShow(!show);
  }

  useEffect(() => {
    const url = 'api/projects';
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects);
      })
  }, []);
  function newProject(Projectname, Status, Hours, TimespanStart, TimespanEnd) {
    // const data = {
    //   parent: {
    //     type: "database_id",
    //     database_id: "3a6e6b4bbcab4f83a66750fc4313e44c"
    //   },
    //   properties: {
    //     Hours: {
    //       number: 16
    //     },
    //     Status: {
    //       select: {
    //         name: "Active"
    //       }
    //     },
    //     Timespan: {
    //       date: {
    //         start: "2000-00-00",
    //         end: "2012-02-13"
    //       }
    //     },
    //     Projectname: {
    //       title: [{
    //         text:
    //         {
    //           content: "The Bestest Project"
    //         }
    //       }]
    //     }
    //   }
    // };

    const url = 'http://localhost:3001/api/projects';
    fetch(url, {
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
            number: 3000,
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
                  content: Projectname
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
          throw new Error('Something went wrong')
        }
        return response.json();
      })
      .then((data) => {
        toggleShow();
        console.log(data);
        setProjects([...projects, data.projects])

      })
      .catch((e) => {
        console.log(e);
      })
  }
  return (
    <>
      <h1>Here is our projects: </h1>
      {/* <ul>
        {customers
          ? customers.map((customer) => {
            return (
              <li key={customer.id}>
                <Link to={'/customers/' + customer.id}>
                  {customer.name}
                </Link>
              </li>
            );
          })
          : null}
      </ul> */}
      <AddTime
        newProject={newProject}
        show={show}
        toggleShow={toggleShow} />
    </>
  )
}
