import { useEffect, useState } from "react";
import {
  GetProject,
  GetPeople,
  GetTime,
} from "../components/TimeComponentfolder/TimeComponent";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";
import BasicExample from "./DataTable";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

export default function TimeSummary() {
  const [showProject, setShowProject] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleShowProject = () => {
    setShowProject(true);
    setShowPeople(false);
    setShowTime(false);
  };

  const handleShowPeople = () => {
    setShowProject(false);
    setShowPeople(true);
    setShowTime(false);
  };

  const handleShowTime = () => {
    setShowProject(false);
    setShowPeople(false);
    setShowTime(true);
  };

  if (showProject) {
    return <BasicExample />;
  } else if (showPeople) {
    return (
      <div>
        <TimeSummary />
        <div>HEllo</div>
      </div>
    );
  } else if (showTime) {
    return (
      <div>
        <BasicExample />
        <div>Hello time</div>
        <div />
      </div>
    );
  }

  return (
    <div className="time_Container">
      <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        <Dropdown.Item onClick={handleShowProject} href="#/asd">
          project DataTable
        </Dropdown.Item>
        <Dropdown.Item onClick={handleShowPeople} href="#/action-2">
          People Datatable
        </Dropdown.Item>
        <Dropdown.Item onClick={handleShowTime} href="#/action-3">
          TimeSummary Datatable?
        </Dropdown.Item>
      </DropdownButton>
      <Routes>
        <Route path="/asd" element={<BasicExample />} />
        <Route path="/action-2" element={<div>HEllo</div>} />
        <Route path="/action-3" element={<div>Hello time</div>} />
      </Routes>
    </div>
  );
}
