import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import { GameMessageEvent } from "lib/types/events";

let events: TypedEmitter<GameMessageEvent> = new EventEmitter();

export { events, TypedEmitter, GameMessageEvent };
