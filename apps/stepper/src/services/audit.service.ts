import type { ActivityEvent } from "@process/activity.js";
import { Service, type ServiceBroker, type Context } from "moleculer";
import DbService from "moleculer-db";
import CouchDBAdapter from 'moleculer-db-adapter-couchdb-nano';
import { configuration } from "../configuration.js";

export default class AuditService extends Service {
    constructor(broker: ServiceBroker) {
        super(broker);
        this.parseServiceSchema({
            name: "audit",
            mixins: [DbService],
            adapter: new CouchDBAdapter(configuration.STP_DB_URI),
            model: {
                name: 'audit',
            },
            settings: {
                fields: ["_id", "flowId", "stepId", "step", "status", "timestamp"]
            },
            channels: {
                "flow.event": {
                    group: this.constructor.name,
                    handler: this.handler,
                },
            }
        });
    }

    async handler(ctx: Context<ActivityEvent>) {
        const { flowId, stepId, step, status, timestamp } = ctx.params;
        this.logger.info(`Tracking |> Flow ${flowId}, Step ${step}, StepId ${stepId}, Status: ${status}, Timestamp: ${timestamp}`);

        await this.adapter.insert({
            flowId,
            stepId,
            step,
            status,
            timestamp
        });
    }
}