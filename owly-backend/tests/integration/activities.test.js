const request = require("supertest");
const app = require("../../app"); // Replace with the path to your Express app
const { Activity, Supervisor } = require("../../models"); // Replace with the path to your Sequelize models

describe("Activity Controller", () => {
  beforeAll(async () => {
    // Set up any necessary test data or environment
    // For example, you might want to create a test user and a test school before running the tests
  });

  afterAll(async () => {
    // Clean up any created test data or reset the environment
    // For example, you might want to delete the test user and test school after running the tests
  });

  describe("POST /schools/:schoolId/activities", () => {
    it("should create a new activity", async () => {
      const testActivity = {
        // Provide necessary request body data for creating an activity
        // Make sure to include the required properties like `req.user`, `req.body`, etc.
      };

      const response = await request(app)
        .post("/schools/:schoolId/activities") // Replace :schoolId with an actual school ID
        .send(testActivity);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("URI");

      // Verify that the activity is created in the database
      const createdActivity = await Activity.findOne({
        where: { id: response.body.URI.match(/activities\/(\d+)/)[1] },
        include: [{ model: Supervisor, as: "supervisors" }],
      });

      expect(createdActivity).toBeTruthy();
      expect(createdActivity.theme).toBe(testActivity.theme);
      expect(createdActivity.name).toBe(testActivity.name);
      expect(createdActivity.startDate.toISOString()).toBe(
        testActivity.startDate.toISOString()
      );
      expect(createdActivity.endDate.toISOString()).toBe(
        testActivity.endDate.toISOString()
      );
      expect(createdActivity.approved).toBe(testActivity.approved);
      expect(createdActivity.reason).toBe(testActivity.reason);
      expect(createdActivity.goal).toBe(testActivity.goal);
      expect(createdActivity.result).toBe(testActivity.result);
      expect(createdActivity.resources).toBe(testActivity.resources);
      expect(createdActivity.location).toBe(testActivity.location);
      expect(createdActivity.notes).toBe(testActivity.notes);
      expect(createdActivity.creatorId).toBe(testActivity.creatorId);
      expect(createdActivity.schoolId).toBe(testActivity.schoolId);

      // Verify that the supervisors are associated with the activity
      expect(createdActivity.supervisors.length).toBeGreaterThan(0);
      const supervisorIds = createdActivity.supervisors.map(
        (supervisor) => supervisor.userId
      );
      expect(supervisorIds).toContain(testActivity.creatorId); // Assuming creator is also a supervisor
    });
  });
});
