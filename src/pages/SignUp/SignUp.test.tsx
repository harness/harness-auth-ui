/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import SignUp from "./Signup";
import { TestWrapper, queryByNameAttribute } from "utils/TestUtils";
import { CATEGORY, PAGE, EVENT } from "utils/TelemetryUtils";

const pageMock = jest.fn();
const trackMock = jest.fn();

jest.mock("telemetry/Telemetry", () => ({
  page: jest.fn().mockImplementation((values) => pageMock(values)),
  track: jest.fn().mockImplementation((values) => trackMock(values)),
  initialized: true
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
        name: PAGE.SIGNUP_PAGE,
        category: CATEGORY.SIGNUP,
        properties: {
          intent: "ci",
          utmCampaign: "",
          utmContent: "",
          utmMedium: "",
          utmSource: "",
          utmTerm: ""
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
        event: EVENT.EMAIL_INPUT,
        properties: {
          category: CATEGORY.SIGNUP,
          email: "random@hotmail.com",
          utmCampaign: "",
          utmContent: "",
          utmMedium: "",
          utmSource: "",
          utmTerm: ""
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
        event: EVENT.SIGNUP_SUBMIT,
        properties: {
          category: CATEGORY.SIGNUP,
          userId: "random@hotmail.com",
          intent: "ci",
          groupId: "random@hotmail.com",
          utmCampaign: "",
          utmContent: "",
          utmMedium: "",
          utmSource: "",
          utmTerm: ""
        }
      })
    );
    expect(container).toMatchSnapshot();
  });
});
