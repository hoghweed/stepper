import { Activity } from "@process/activity.js";
import type { Execution, ExecutionResult } from "@process/execution.js";
import type { ServiceBroker } from "moleculer";

export default class InviteScreening extends Activity {
    constructor(broker: ServiceBroker) {
        super(broker);
        super.initialize();
    }

    override execute(execution: Execution): Promise<ExecutionResult> {
        return Promise.resolve(execution.completed({ InviteSent: Date.now() }));
    }

    override compensate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}