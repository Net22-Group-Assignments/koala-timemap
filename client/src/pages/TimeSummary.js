import { useState } from "react";
import GetTime from "../components/GetTime";

export default function TimeSummary() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // if (show) {
  //   return (
  //     <GetTime />
  //   )
  // }
  return <GetTime />
  // return (
  //   <div>
  //     <button onClick={handleShow}>Click</button>

  //     <br></br>
  //     <button onClick={handleClose}>Close</button>
  //   </div>
  // )
}
