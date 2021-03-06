/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import qs from "qs";
import { compile } from "path-to-regexp";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { RestfulProvider, UseGetProps } from "restful-react";
import { queryByAttribute } from "@testing-library/react";

export interface TestWrapperProps {
  path?: string;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, unknown>;
}

export const TestWrapper: React.FC<TestWrapperProps> = (props) => {
  const { path = "/", pathParams = {}, queryParams = {} } = props;

  const search = qs.stringify(queryParams, { addQueryPrefix: true });
  const routePath = compile(path)(pathParams) + search;

  const history = React.useMemo(
    () => createMemoryHistory({ initialEntries: [routePath] }),
    []
  );

  return (
    <Router history={history}>
      <RestfulProvider base="/">
        <Switch>
          <Route exact path={path}>
            {props.children}
          </Route>
        </Switch>
      </RestfulProvider>
    </Router>
  );
};

export const queryByNameAttribute = (
  name: string,
  container: HTMLElement
): HTMLElement | null => queryByAttribute("name", container, name);

export type UseGetMockData<
  TData,
  TError = undefined,
  TQueryParams = undefined,
  TPathParams = undefined
> = Required<UseGetProps<TData, TError, TQueryParams, TPathParams>>["mock"];
