function TimeReport(date, personId, hours, projectId, note) {
  (this.Date = {
    date: {
      start: date.toLocaleDateString("se-sv"),
    },
  }),
    (this.Person = {
      relation: [{ id: personId }],
    }),
    (this.Hours = {
      number: 2,
    }),
    (this.Project = {
      relation: [
        {
          id: projectId,
        },
      ],
    }),
    (this.Note = {
      title: [
        {
          text: {
            content: note,
          },
        },
      ],
    });
}

module.exports = TimeReport;
