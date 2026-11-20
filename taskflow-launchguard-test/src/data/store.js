// In-memory storage keeps this demo small. Data resets whenever the server restarts.
module.exports = {
  users: [],
  tasks: [
    {
      id: 1,
      title: "Explore the TaskFlow demo",
      description: "Create, complete, and filter a few tasks.",
      priority: "Medium",
      completed: false,
      userId: 1
    }
  ],
  nextUserId: 1,
  nextTaskId: 2
};
