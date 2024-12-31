# Routing Slip Example

A Routing Slip defines the sequence of steps for a workflow.

## Example
```json
{
  "steps": [
    { "step": "validateOrder", "endpoint": "validation.validate" },
    { "step": "processPayment", "endpoint": "payment.process", "condition": { "orderValid": true } },
    { "step": "updateInventory", "endpoint": "inventory.update" }
  ],
  "currentStepIndex": 0
}