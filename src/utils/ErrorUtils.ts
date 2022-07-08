/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import toast from "react-hot-toast";

export function handleError(error: any): void {
  const response = error?.data;

  if (
    response?.responseMessages?.length > 0 &&
    response?.responseMessages[response.responseMessages.length - 1].message
  ) {
    toast(
      response.responseMessages[response.responseMessages.length - 1].message ||
        ""
    );
  } else if (error.message) {
    if (error.status !== 429) {
      toast(error.message);
    }
  } else if (typeof error === "string") {
    toast(error);
  }
}
