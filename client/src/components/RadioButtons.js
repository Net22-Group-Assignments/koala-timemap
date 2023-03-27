import { useState } from "react";
import Form from "react-bootstrap/Form";

function CheckProjectStatus() {
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
            onChange={""}
          />
          <Form.Check
            inline
            label="Done"
            name="group1"
            type={type}
            id={`inline-${type}-2`}
            onChange={""}
          />
          <Form.Check
            inline
            label="Next Up"
            name="group1"
            type={type}
            id={`inline-${type}-3`}
            onChange={""}
          />
        </div>
      ))}
    </Form>
  );
}

export default CheckProjectStatus;
