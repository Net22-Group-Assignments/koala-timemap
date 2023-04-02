import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { StatusSelect } from "../../components/StatusSelect";
import { getProjectRequestObject } from "../../utilities/fetchFunctions";

import "./TimeSummary.css";

export default function EditProject(props) {
  const [editProject, setEditProject] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");
  const [hours, setHours] = useState("");
  const [showEditProject, setShowEditProject] = useState(props.show);
  const [timespanStart, setTimespanStart] = useState("");
  const [timespanEnd, setTimespanEnd] = useState("");

  const projectOptions = props.projects.map((project) => ({
    value: project.id,
    label: project.properties.Projectname.title[0].text.content,
  }));

  const handleEditProjectChange = (selectedProject) => {
    const projectToUpdate = props.projects.find(
      (project) => project.id === selectedProject.value
    );
    onShowHandler(projectToUpdate);
  };

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus.value);
  };

  // Date change handler that checks if timespanEnd date is after timespanStart date
  // and shows an error message if it is not and does not update the state
  const onDateChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "timespanStart" && value > timespanEnd) {
      alert("Start date must be before end date");
    } else if (name === "timespanEnd" && value < timespanStart) {
      alert("End date must be after start date");
    } else {
      if (name === "timespanStart") {
        setTimespanStart(value);
      } else if (name === "timespanEnd") {
        setTimespanEnd(value);
      }
    }
  };

  const onShowHandler = (selectedProject = props.projects[0]) => {
    setEditProject(selectedProject);
    setProjectName(
      selectedProject.properties.Projectname.title[0].text.content
    );
    setStatus(selectedProject.properties.Status.select.name);
    setHours(selectedProject.properties.Hours.number);
    setTimespanStart(selectedProject.properties.Timespan.date.start);
    setTimespanEnd(selectedProject.properties.Timespan.date.end);
  };

  const handleClose = () => setShowEditProject(false);
  const handleShow = () => setShowEditProject(true);

  return (
    <>
      <button
        onClick={props.toggleShowEditProject}
        className="m-2 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        id="add_btn"
      >
        Update Project
      </button>

      <Modal
        show={props.showEditProject}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        onShow={onShowHandler}
      >
        <Modal.Header>
          <Modal.Title>Update Project Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              try {
                props.updateProjects(
                  getProjectRequestObject({
                    id: editProject.id,
                    name: projectName,
                    status: status,
                    hours: hours,
                    start: timespanStart,
                    end: timespanEnd,
                  })
                );
              } catch (e) {
                console.error(e);
              }
              e.preventDefault();
              setEditProject(null);
              setProjectName("");
              setStatus("");
              setHours("");
              setTimespanStart("");
              setTimespanEnd("");
              props.toggleShowEditProject();
            }}
            id="editmodal"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="name"
                >
                  Project Name
                </label>
              </div>
              <div className="md:w-2/3">
                <Select
                  autoFocus={true}
                  defaultValue={projectOptions[0]}
                  options={projectOptions}
                  onChange={handleEditProjectChange}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="name"
                >
                  New Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="name"
                  placeholder="The bestest Project"
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="industry"
                >
                  Status
                </label>
              </div>
              <div className="md:w-2/3">
                <StatusSelect value={status} onChange={handleStatusChange} />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="industry"
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
                  onChange={onDateChangeHandler}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.toggleShowEditProject}
          >
            Close
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            form="editmodal"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
