import { useState } from "react";
import Form from "react-bootstrap/Form";

function CheckProjectStatus(props) {
  const [checkActive, setCheckActive] = useState();
  const [checkDone, setCheckDone] = useState();
  const [checkNextUp, setCheckNextUp] = useState();

  const toConsole = () => {
    return console.log("Success");
  };

  return (
    <Form>
      {["radio"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
          <Form.Check
            inline
            label="Active"
            name="group1"
            type={type}
            id={`inline-${type}-1`}
            value={checkActive}
            onChange={(e) => {
              e.preventDefault();
              setCheckActive("");
              props.TimeSummary();
            }}
          />
          <Form.Check
            inline
            label="Done"
            name="group1"
            type={type}
            id={`inline-${type}-2`}
            value={checkDone}
            onChange={(e) => {
              e.preventDefault();
              setCheckDone("");
              props.TimeSummary();
            }}
          />
          <Form.Check
            inline
            label="Next Up"
            name="group1"
            type={type}
            id={`inline-${type}-3`}
            value={checkNextUp}
            onChange={(e) => {
              e.preventDefault();
              setCheckNextUp("");
              props.TimeSummary();
            }}
          />
        </div>
      ))}
    </Form>
  );
}

export default CheckProjectStatus;
