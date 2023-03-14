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
    const url = '/projects';
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects);
      })
  }, []);
  function newProject(Projectname, Status, Hours, WorkedHours, HoursLeft, Timespan) {
    const data = {
      Projectname: Projectname, Status: Status, Hours: Hours, WorkedHours: WorkedHours, HoursLeft: HoursLeft, Timespan: Timespan
    };

    //   {
    //     parent: {
    //     type: "database_id"
    //     database_id: "3a6e6b4b-bcab-4f83-a667-50fc4313e44c"
    //   },
    //   properties: {
    //     Hours:{
    //         number: 10
    //     },
    //     Status: {
    //         select: {
    //         name: "Done"
    //       }
    //     },
    //     Timespan: {
    //         start: "2012-02-07",
    //       end: "2012-02-13",
    //     }
    //     Projectname: {
    //         title: [ 
    //       text: {
    //         content: "My newest project"
    //       }
    //       ]
    //     }
    //   }
    // }

    const url = '/projects';
    console.log(data);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
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
