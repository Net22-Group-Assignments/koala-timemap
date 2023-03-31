import { useAuthHeader } from "react-auth-kit";

const useNewProject = () => {
  const authHeader = useAuthHeader();
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
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return { newProject };
};

const useProjectEdit = () => {
  const authHeader = useAuthHeader();
  function ProjectEdit(ProjectId, Status, Hours) {
    fetch("/api/pages/" + ProjectId, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: authHeader(),
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
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return { ProjectEdit };
};

const useNewTimeReport = () => {
  const authHeader = useAuthHeader();
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
        //console.log(response);
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return { newTimeReport };
};

export { useNewProject, useProjectEdit, useNewTimeReport };
