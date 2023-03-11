import { useEffect, useState } from "react";
import { GetProject, GetPeople, GetTime } from "./TimeComponent";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "./DataTable";
import "./TimeSummary.css";

export default function TimeSummary() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="time_Container">
      <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        <Dropdown.Item onClick={handleShow} href="./DataTable">
          project hello
        </Dropdown.Item>
        <Dropdown.Item onClick={handleShow} href="#/action-2">
          People
        </Dropdown.Item>
        <Dropdown.Item onClick={handleShow} href="#/action-3">
          TimeSummary
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
{
  /* <div className="Container1">
        <GetProject />
      </div>
      <div className="Container2">
        <GetPeople />
      </div>
      <div className="Container3">
        <GetTime />
      </div> */
}
