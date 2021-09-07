import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import SignUp from "./Signup";
import { TestWrapper, queryByNameAttribute } from "utils/TestUtils";

const pageMock = jest.fn();
const trackMock = jest.fn();

jest.mock("telemetry/Telemetry", () => ({
  page: jest.fn().mockImplementation((values) => pageMock(values)),
  track: jest.fn().mockImplementation((values) => trackMock(values))
}));

describe("SignUp", () => {
  test("render", () => {
    const { container } = render(
      <TestWrapper path={"/signup"}>
        <SignUp />
      </TestWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  test("telemetry", async () => {
    const { container, getByRole } = render(
      <TestWrapper path={"/signup"} queryParams={{ module: "ci" }}>
        <SignUp />
      </TestWrapper>
    );
    await waitFor(() =>
      expect(pageMock).toBeCalledWith({
        name: "Signup Page",
        category: "SIGNUP",
        properties: {
          userId: "",
          groupId: "",
          module: "ci"
        }
      })
    );
    fireEvent.input(queryByNameAttribute("email", container)!, {
      target: { value: "random@hotmail.com" },
      bubbles: true
    });
    fireEvent.focusOut(queryByNameAttribute("email", container)!);
    await waitFor(() =>
      expect(trackMock).toBeCalledWith({
        event: "Email input",
        properties: {
          category: "SIGNUP",
          userId: "random@hotmail.com",
          groupId: ""
        }
      })
    );
    fireEvent.input(queryByNameAttribute("password", container)!, {
      target: { value: "12345678" },
      bubbles: true
    });
    fireEvent.click(getByRole("button", { name: "Sign up" }));

    await waitFor(() =>
      expect(trackMock).toBeCalledWith({
        event: "Signup submit",
        properties: {
          category: "SIGNUP",
          userId: "random@hotmail.com",
          groupId: ""
        }
      })
    );
    expect(container).toMatchSnapshot();
  });
});
