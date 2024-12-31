# Activity Service API

The **Activity Service** is responsible for executing steps in the routing slip.

## Methods
1. `executeActivity`: Executes an activity based on the routing slip.
2. `compensateActivity`: Rolls back an activity in case of failure.

## Example
```typescript
await broker.call("activity.executeActivity", { activityId: "12345" });
```