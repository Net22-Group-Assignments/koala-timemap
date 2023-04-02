// These fuctions are used to create the request bodies for the Notion API.
// They are used in the routes for the timereports and projects endpoints.
// Undefinded values are not included in the request body when doing patch
// requests so that the Notion API does not overwrite existing values with empty strings.
const getTimeReportRequestObject = ({
  id: TimeReportId,
  date: Date,
  personId: PersonId,
  hours: Hours,
  projectId: ProjectId,
  note: Note,
}) => {
  return {
    page_id: TimeReportId ? TimeReportId : undefined,
    properties: {
      Date: Date ? { date: { start: Date } } : undefined,
      Person: PersonId
        ? {
            relation: [
              {
                id: PersonId,
              },
            ],
          }
        : undefined,
      Hours: Hours
        ? {
            number: parseInt(Hours),
          }
        : undefined,
      Project: ProjectId
        ? {
            relation: [
              {
                id: ProjectId,
              },
            ],
          }
        : undefined,
      Note: Note
        ? {
            title: [
              {
                text: {
                  content: Note,
                },
              },
            ],
          }
        : undefined,
    },
  };
};

const getProjectRequestObject = ({
  id: ProjectId,
  name: Projectname,
  status: Status,
  hours: Hours,
  start: TimespanStart,
  end: TimespanEnd,
}) => {
  return {
    page_id: ProjectId ? ProjectId : undefined,
    properties: {
      Projectname: Projectname
        ? {
            title: [
              {
                text: {
                  content: Projectname,
                },
              },
            ],
          }
        : undefined,
      Status: Status
        ? {
            select: {
              name: Status,
            },
          }
        : undefined,
      Hours: Hours
        ? {
            number: parseInt(Hours),
          }
        : undefined,
      Timespan:
        TimespanStart || TimespanEnd
          ? {
              date: {
                start: TimespanStart ? TimespanStart : undefined,
                end: TimespanEnd ? TimespanEnd : undefined,
              },
            }
          : undefined,
    },
  };
};

export { getTimeReportRequestObject, getProjectRequestObject };
