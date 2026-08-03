import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders timer and stopwatch tabs", () => {
  render(<App />);
  expect(screen.getByText(/Timer/i)).toBeInTheDocument();
  expect(screen.getByText(/Stopwatch/i)).toBeInTheDocument();
  expect(screen.getByText("05m:00s")).toBeInTheDocument();
  expect(screen.getByText("START")).toBeInTheDocument();
  expect(screen.getByText("RESET")).toBeInTheDocument();
});
