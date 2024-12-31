import closeWithGrace from "close-with-grace";
import { Middleware as ChannelsMiddleware } from '@moleculer/channels';
import { type Middleware, ServiceBroker } from 'moleculer';
import type { MiddlewareOptions } from '@moleculer/channels/types/src';
import { configuration } from "./configuration.js";
import ExecutionBuilder from "@process/builder.js";

const broker = new ServiceBroker({
    nodeID: 'stepper-1',
    middlewares: [
        ChannelsMiddleware({
            adapter: configuration.STP_NATS_URI,
            sendMethodName: "sendToChannel",
            context: true
        } as MiddlewareOptions) as unknown as Middleware,],
});

closeWithGrace(
    { delay: 2500 },
    async ({ err, signal }: { err?: Error; signal?: string }) => {
        if (err) {
            broker.logger.error(err);
        }

        broker.logger.info(`[${signal}] Gracefully closing the server instance.`);
        await broker.stop();
    },
);

broker.loadServices(
    configuration.SERVICES_URI, 
    configuration.SERVICES_MASK
);
await broker.start();

const evaluateChrisis = new ExecutionBuilder()
    .variable('PatientID', '123')
    .step('CrisisEvaluation')
    .step('EmergencyTeamNotifier', { CrisisLevel: 'High' })
    .step('ScheduleSession', { CrisisLevel: 'Medium' })
    .step('SelfHelp', { CrisisLevel: 'Low' })
    .build(broker);

await evaluateChrisis.start();

const healthScreening = new ExecutionBuilder()
    .variable('PatientID', '123')
    .step('InviteScreening')
    .step('ScheduleAppointment')
    .step('ConductScreening')
    .step('DiagnosticTests', { ScreeningResults: 'Positive' })
    .step('RemindNextScreening', { ScreeningResults: 'Negative' })
    .build(broker);

await healthScreening.start();

declare module 'moleculer' {
    export interface ServiceBroker {
        sendToChannel<E>(channel: string, data: E, opts: GenericObject): Promise<void>;
        sendToChannel<E>(channel: string, data: E): Promise<void>;
    }
}
