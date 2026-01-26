import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "eventemitter2";

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(event: string, payload: any): void {
    console.log(`Emitindo evento: ${event}`, payload);
    this.eventEmitter.emit(event, payload);
  }

  emitAsync(event: string, payload: any): void {
    console.log(`Emitindo evento assíncrono: ${event}`, payload);
    this.eventEmitter.emitAsync(event, payload);
  }
}