import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useAuthUser } from "react-auth-kit";
import { getTimeReportRequestObject } from "../../utilities/fetchFunctions";

import "./TimeSummary.css";

export default function AddTime(props) {
  const auth = useAuthUser();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [person, setPerson] = useState(auth().person);
  const [hours, setHours] = useState("0");
  const [project, setProject] = useState(null);
  const [note, setNote] = useState("");
  const [showTime, setShowTime] = useState(props.show);
  const handleClose = () => setShowTime(false);
  const handleShow = () => setShowTime(true);
  const [timespanStart, setTimespanStart] = useState("");
  const [timespanEnd, setTimespanEnd] = useState("");

  const projectOptions = props.projects.map((project) => ({
    value: project.id,
    label: project.properties.Projectname.title[0].text.content,
  }));

  const handleProjectChange = (selectedProject) => {
    const currentProject = props.projects.find(
      (project) => project.id === selectedProject.value
    );
    onShowHandler(currentProject);
  };

  const onShowHandler = (selectedProject = props.projects[0]) => {
    setProject(selectedProject);
    setTimespanStart(selectedProject.properties.Timespan.date.start);
    setTimespanEnd(selectedProject.properties.Timespan.date.end);
    setDate(selectedProject.properties.Timespan.date.start);
  };

  // Date change handler that checks it the date is between choosen projects start and end date
  const onDateChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "date" && value < project.properties.Timespan.date.start) {
      alert("Reported date must be after project start date");
    } else if (
      name === "date" &&
      value > project.properties.Timespan.date.end
    ) {
      alert("Reported date must be before project end date");
    } else {
      setDate(value);
    }
  };

  return (
    <>
      <button
        onClick={props.toggleShowTime}
        className="m-2 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        id="add_btn"
      >
        Report Time
      </button>

      <Modal
        show={props.showTime}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        onShow={onShowHandler}
      >
        <Modal.Header>
          <Modal.Title>Add Time Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              try {
                props.addTimeReport(
                  getTimeReportRequestObject({
                    date: date,
                    personId: person.id,
                    hours: hours,
                    projectId: project.id,
                    note: note,
                  })
                );
              } catch (e) {
                console.error(e);
              }

              e.preventDefault();
              setDate(new Date().toISOString().slice(0, 10));
              //setPerson(useState(auth().person));
              setHours("1");
              setProject(props.projects[0]);
              setNote("");
              props.toggleShowTime();
            }}
            id="addmodal"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="name"
                >
                  Date
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="Do not type anything"
                  type="text"
                  value={person.name}
                  onChange={(e) => {
                    setPerson(e.target.value);
                  }}
                  disabled={true}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Project
                </label>
              </div>
              <div className="md:w-2/3">
                <Select
                  options={projectOptions}
                  defaultValue={projectOptions[0]}
                  // value={projectOptions[0]}
                  onChange={handleProjectChange}
                  isSearchable={true}
                  required={true}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Project Start
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  name="timespanStart"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="2000-00-00"
                  type="date"
                  value={timespanStart}
                  disabled={true}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Project End
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  name="timespanEnd"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="2000-00-00"
                  type="date"
                  value={timespanEnd}
                  disabled={true}
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="name"
                >
                  Date
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  name="date"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="name"
                  placeholder="2000-00-00"
                  type="date"
                  value={date}
                  onChange={onDateChangeHandler}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Hours
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="0"
                  type="number"
                  min={0}
                  value={hours}
                  onChange={(e) => {
                    setHours(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Note
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="Some notes taken"
                  type="text"
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.toggleShowTime}
          >
            Close
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            form="addmodal"
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
