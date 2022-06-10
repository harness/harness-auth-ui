/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import { render, act, fireEvent, waitFor } from "@testing-library/react";

import { TestWrapper } from "utils/TestUtils";
import { EMAIL_VERIFY_STATUS } from "utils/StringUtils";
import { EVENT, CATEGORY } from "utils/TelemetryUtils";
import { useResendVerifyEmail } from "services/ng";
import VerifyEmailStatus, { VERIFY_EMAIL_STATUS } from "./VerifyEmailStatus";

jest.mock("services/ng");
const useResendVerifyEmailMock = useResendVerifyEmail as jest.MockedFunction<any>;

const trackMock = jest.fn();

jest.mock("telemetry/Telemetry", () => ({
  track: jest.fn().mockImplementation((values) => trackMock(values))
}));

describe("Verify Email", () => {
  test("should display an email sent message", async () => {
    await act(async () => {
      const { getByText } = render(
        <TestWrapper path={"/register/verify/token123"}>
          <VerifyEmailStatus status={VERIFY_EMAIL_STATUS.EMAIL_SENT} />
        </TestWrapper>
      );

      expect(getByText(EMAIL_VERIFY_STATUS.EMAIL_SENT)).toBeDefined();
    });
  });

  test("should track the event when resend email", async () => {
    useResendVerifyEmailMock.mockImplementation(() => {
      return {
        loading: false,
        mutate: jest.fn()
      };
    });
    await act(async () => {
      const { getByText } = render(
        <TestWrapper path={"/register/verify/token123"}>
          <VerifyEmailStatus
            status={VERIFY_EMAIL_STATUS.EMAIL_SENT}
            email="random@harness.io"
          />
        </TestWrapper>
      );
      fireEvent.click(getByText("Resend verification email"));

      await waitFor(() => {
        expect(trackMock).toHaveBeenCalledWith({
          event: EVENT.RESEND_VERIFY_EMAIL,
          properties: {
            category: CATEGORY.SIGNUP,
            userId: "random@harness.io"
          }
        });
        expect(getByText(EMAIL_VERIFY_STATUS.EMAIL_SENT)).toBeDefined();
      });
    });
  });

  test("should display an already signed up message", async () => {
    await act(async () => {
      const { getByText } = render(
        <TestWrapper path={"/register/verify/token123"}>
          <VerifyEmailStatus status={VERIFY_EMAIL_STATUS.SIGNED_UP} />
        </TestWrapper>
      );

      expect(getByText(EMAIL_VERIFY_STATUS.ALREADY_SIGNED_UP)).toBeDefined();
    });
  });

  test("should display an email sent message when the component doesn't have a status", async () => {
    await act(async () => {
      const { getByText } = render(
        <TestWrapper path={"/register/verify/token123"}>
          <VerifyEmailStatus />
        </TestWrapper>
      );

      expect(getByText(EMAIL_VERIFY_STATUS.EMAIL_SENT)).toBeDefined();
    });
  });
});
