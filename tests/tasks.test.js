import request from "supertest";
import app from "./setup.js";

// ensure test environment variables are loaded

let token;
let taskId;

beforeAll(async () => {
  // Register
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Task User",
      email: "task@example.com",
      password: "123456"
    });

  // Login
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "task@example.com",
      password: "123456"
    });

  token = res.body.token;
});

describe("Task Routes", () => {

  it("should not allow access without token", async () => {
    const res = await request(app)
      .get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");

    taskId = res.body._id;
  });

  it("should get user tasks only", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should delete own task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should not delete someone else's task", async () => {
    // create a second user
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Other", email: "other@example.com", password: "123456" });
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "other@example.com", password: "123456" });
    const otherToken = loginRes.body.token;

    // create a task as first user again
    const newTask = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Another Task" });

    const res = await request(app)
      .delete(`/api/tasks/${newTask.body._id}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(403);
  });

});