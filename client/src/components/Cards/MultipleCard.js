import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useState, useEffect, useReducer } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";

export default function MultiCard() {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [projects, setProjects] = useState();

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

  return (
    <Card style={{ width: "18rem" }}>
      <ListGroup variant="flush">
        {projects
          ? projects.map((project) => {
              <ListGroup.Item>
                {project.properties.Projectname.title[0].text.content}
                {console.log("HejHej")}
              </ListGroup.Item>;
            })
          : null}
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
