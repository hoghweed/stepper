import type { ServiceBroker } from 'moleculer';

export type Step = {
    ID: string
    dependsOn?: Record<string, unknown>
    name: string
};

export type Plan = {
    ID: string
    steps: Step[],
    vars: Map<string, unknown>
}

export type ExecutionResult = {
    ID: string
    reason?: string
    log?: Record<string, unknown>
    status: 'completed' | 'faulted'
}

export class Execution {
    private broker: ServiceBroker;
    private plan: Plan

    constructor(broker: ServiceBroker, plan: Plan) {
        this.broker = broker;
        this.plan = plan;
    }

    async start() {
        // find the first step
        const step = this.plan.steps.find(step => !step.dependsOn);

        if (!step) {
            return;
        }

        await this.broker.sendToChannel(`activities.${step.name}.execute` , this.plan);
    }

    completed(log?: Record<string, unknown>) : ExecutionResult {
        return {
            ID: this.plan.ID,
            log,
            status: 'completed'
        };
    };

    faulted(reason: string) : ExecutionResult {
        return {
            ID: this.plan.ID,
            reason,
            status: 'faulted'
        };
    }
;}