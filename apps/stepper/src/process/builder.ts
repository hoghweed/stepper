import type { ServiceBroker } from "moleculer";
import { Execution, type Step } from "./execution.js";
import crypto from 'node:crypto';

export default class ExecutionBuilder {
    private ID!: string;
    private steps!: Step[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    private vars: Map<string, any>;

    constructor() {
        this.ID = crypto.randomBytes(7).toString('hex');
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        this.vars = new Map<string, any>();
        this.steps = [];
    }

    step(activity: string, dependsOn?: Record<string, unknown>) : ExecutionBuilder {
        const step: Step = {
            ID: crypto.randomBytes(7).toString('hex'),
            name: activity,
            dependsOn
        };

        this.steps.push(step);
        return this;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    variable(name: string, value: any) : ExecutionBuilder { 
        this.vars.set(name, value);
        return this;
    }

    build(broker: ServiceBroker): Execution {
        return new Execution(broker, {
            ID: this.ID,
            steps: this.steps,
            vars: this.vars
        });
    }
}