import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  xit("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    })
  });

  xit("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application/>);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0]; 

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: "Lydia Miller-Jones"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
   

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  xit("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    //Render
    const { container, debug } = render(<Application/>);

    //Wait for load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //Click the delete button
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));

    //check that the confirmation message is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Confirm"));

    //click the confirm button
    fireEvent.click(getByText(appointment, "Confirm"));

    //check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //Wait until the element with Add button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    //Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
    //debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //Render
    const { container, debug } = render(<Application/>);

    //Wait for load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //Click the edit button
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Edit"));

    //check that the confirmation message is shown
    expect(
      getByText(appointment, "Interviewer")
    ).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Interviewer"));

    //click the confirm button
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();
    
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
    //debug();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
  });
}); 
