// Explicit import: the global `expect` is Cypress' chai one
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { createServer, IncomingMessage, Server } from "http";
import { AddressInfo } from "net";
import { addVisualRegressionTrackerPlugin } from "./plugin";
import { VRT_TASK_START, VRT_TASK_STOP } from "./utils";

type Task = (props: unknown) => Promise<unknown>;
type RecordedRequest = { method?: string; url?: string; body: unknown };

const build = { id: "a9385fc1-884d-4f9f-915e-40da0e7773d5", projectId: "projectId" };

const readBody = (req: IncomingMessage): Promise<unknown> =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data ? JSON.parse(data) : undefined));
  });

// Minimal stand-in for the VRT API that records what the plugin sends
const startApi = async (requests: RecordedRequest[]) => {
  const server = createServer(async (req, res) => {
    requests.push({ method: req.method, url: req.url, body: await readBody(req) });
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ...build, isRunning: req.method !== "PATCH" }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return server;
};

const registerTasks = (apiUrl: string) => {
  const tasks: Record<string, Task> = {};
  const on = (event: string, handlers: Record<string, Task>) => {
    if (event === "task") {
      Object.assign(tasks, handlers);
    }
  };
  const config = {
    env: {
      visualRegressionTracker: {
        apiUrl,
        apiKey: "apiKey",
        project: "project",
        branchName: "develop",
        enableSoftAssert: false,
      },
    },
  };
  addVisualRegressionTrackerPlugin(
    on as unknown as Cypress.PluginEvents,
    config as unknown as Cypress.PluginConfigOptions
  );
  return tasks;
};

describe("addVisualRegressionTrackerPlugin", () => {
  let server: Server;
  let requests: RecordedRequest[];
  let tasks: Record<string, Task>;

  beforeEach(async () => {
    requests = [];
    server = await startApi(requests);
    const { port } = server.address() as AddressInfo;
    tasks = registerTasks(`http://127.0.0.1:${port}`);
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it("vrtStop should mark the started build as not running", async () => {
    expect(await tasks[VRT_TASK_START]({})).toBeNull();
    expect(await tasks[VRT_TASK_STOP]({})).toBeNull();

    expect(requests).toEqual([
      expect.objectContaining({ method: "POST", url: "/builds" }),
      { method: "PATCH", url: `/builds/${build.id}`, body: { isRunning: false } },
    ]);
  });

  it("vrtStop should do nothing if not started", async () => {
    expect(await tasks[VRT_TASK_STOP]({})).toBeNull();

    expect(requests).toEqual([]);
  });
});
