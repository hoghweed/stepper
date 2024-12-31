import { Activity } from "@process/activity.js";
import type { ServiceBroker } from "moleculer";
import type { Execution, ExecutionResult } from '@process/execution.js';

export default class EmergencyTeamNotifier extends Activity {
    constructor(broker: ServiceBroker) {
        super(broker);
        super.initialize();
    }

    override execute(execution: Execution): Promise<ExecutionResult> {
        return Promise.resolve(execution.completed());
    }

    override compensate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}