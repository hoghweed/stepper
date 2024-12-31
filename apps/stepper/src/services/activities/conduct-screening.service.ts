import { Activity } from "@process/activity.js";
import type { Execution, ExecutionResult } from "@process/execution.js";
import type { ServiceBroker } from "moleculer";

export default class ConductScreening extends Activity {
    constructor(broker: ServiceBroker) {
        super(broker);
        super.initialize();
    }

    override execute(execution: Execution): Promise<ExecutionResult> {
        const levels = ['Positive', 'Negative', 'Inconclusive'];
        const level = levels[Math.floor(Math.random() * levels.length)];

        this.logger.info(`Screening result is ${level}`);

        return Promise.resolve(execution.completed({ ScreeningResults: level }));
    }

    override compensate(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}