import { useState } from "react";
import Form from "react-bootstrap/Form";

function CheckProjectStatus(props) {
  let label = "";

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
          />
          <Form.Check
            inline
            label="Done"
            name="group1"
            type={type}
            id={`inline-${type}-2`}
            onChange={() => {
              return label;
            }}
          />
          <Form.Check
            inline
            label="Next Up"
            name="group1"
            type={type}
            id={`inline-${type}-3`}
            onChange={() => {
              return label;
            }}
          />
        </div>
      ))}
    </Form>
  );
}

export default CheckProjectStatus;
