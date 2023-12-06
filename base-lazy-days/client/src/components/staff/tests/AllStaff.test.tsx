import { screen } from "@testing-library/react";

import { rest } from "msw";
import { server } from "../../../mocks/server";
import { AllStaff } from "../AllStaff";
import { renderWithQueryClient } from "test-utils";

test("renders response from query", async () => {
    // write test here
    renderWithQueryClient(<AllStaff />);

    const staffNames = await screen.findAllByRole("heading", {
        name: /sandra|divya|mateo|michael/i,
    });

    expect(staffNames).toHaveLength(4);
});

test("handles query error", async () => {
    // (re)set handler to return a 500 error for staff
    // server.resetHandlers(
    //   rest.get('http://localhost:3030/staff', (req, res, ctx) => {
    //     return res(ctx.status(500));
    //   }),
    // );
});
