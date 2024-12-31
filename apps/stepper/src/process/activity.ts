import { type Context, Service, type ServiceSchema } from "moleculer";
import { Execution, type Step, type ExecutionResult, type Plan } from "./execution.js";

import { configuration } from "../configuration.js";

import DbService from 'moleculer-db';
import CouchDBAdapter from 'moleculer-db-adapter-couchdb-nano';

export type ActivityEvent = {
    flowId: string;
    stepId: string;
    step: string;
    status: string;
    timestamp: string;
}

type FlowLog = {
    flowId: string;
    steps: { stepId: string, step: string, log?: Record<string, unknown> }[];
}

export abstract class Activity extends Service {

    initialize(): void {
        const schema: ServiceSchema = {
            name: this.constructor.name,
            mixins: [DbService],
            adapter: new CouchDBAdapter(configuration.STP_DB_URI), //new SqlAdapter(configuration.STP_DB_URI),
            model: {
                name: 'flows',
            },
            actions: {
                async status(ctx) {
                    return {
                        status: "ok"
                    };
                }
            },
            channels: {
                [`activities.${this.constructor.name}.execute`]: {
                    group: this.constructor.name,
                    handler: this.handler,
                },
                [`activities.${this.constructor.name}.compensate`]: {
                    group: this.constructor.name,
                    handler: this.handler,
                }
            }
        }
        super.parseServiceSchema(schema);
    }

    async handler(ctx: Context): Promise<void> {
        const plan = ctx.params as Plan;
        const stepId = plan?.steps[0]?.ID;
        const execution = new Execution(this.broker, plan);
        
        this.broker.sendToChannel('flow.event', { flowId: plan.ID, stepId, step: this.name, status: 'started', timestamp: new Date().toISOString() });
        
        try {
            const result = await this.execute(execution);
            this.broker.sendToChannel('flow.event', { flowId: plan.ID, stepId, step: this.name, status: result.status, timestamp: new Date().toISOString() });
            const flowLog = await this.getFlowLog(plan);
            
            if (result.status === 'completed') {
                plan.steps.shift();
                const nextStep = this.calculateNextStep(plan.steps, result.log);

                
                if (stepId) {
                    flowLog?.steps.push({ stepId: stepId, step: this.name, log: result.log });
                    await this.updateFlowLog(flowLog);
                }

                if (nextStep) {
                    await this.broker.sendToChannel(`activities.${nextStep.name}.execute`, plan);
                }
            }
            else {
                await this.compensate();
            }

        }
        catch (error) {
            await this.compensate();
        }
    }

    async getFlowLog(plan: Plan): Promise<FlowLog> {
        const flow = await this.adapter.find({ selector: { flowId: plan.ID } });
        if (flow.length > 0) {
            return flow[0];
        }

        const result = await this.adapter.insert({
          flowId: plan.ID,
          steps: [] 
        });

        return result;
    }

    async updateFlowLog(flowLog: FlowLog): Promise<FlowLog | null> {
        await this.adapter.updateMany(
            { flowId: flowLog.flowId }, 
            { steps: flowLog.steps }
        );

        return flowLog;
    } 

    calculateNextStep(steps: Step[], log: Record<string, unknown> = {}): Step | null {

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];

            if (step?.dependsOn) {
                const conditionKeys = Object.keys(step.dependsOn);

                const satisfied = conditionKeys.every((key) => {
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    return log[key] !== undefined && log[key] === step.dependsOn![key];
                });

                if (satisfied) {
                    return step;
                }
            } else {
                return step ?? null;
            }
        }
        return null;
    }


    abstract execute(execution: Execution): Promise<ExecutionResult>;

    abstract compensate(log?: Record<string, unknown>): Promise<void>;
}