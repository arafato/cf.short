import { DurableObject } from "cloudflare:workers";

const START: number = 10;

export default class Counter extends DurableObject {

    async getCounterValue() {
        const value = (await this.ctx.storage.get("value")) || START;
        console.log(`Counter value: ${value}`);
        return value;
    }

    async increment(amount = 1) {
        let value: number = (await this.ctx.storage.get("value")) || START;
        value += amount;
        await this.ctx.storage.put("value", value);
        console.log(`Counter incremented to: ${value}`);
        return value;
    }
}