/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import { Actor, lookup } from "actor-helpers/src/actor/Actor.js";

declare global {
  interface ActorMessageType {
    state: Message;
  }
}

export interface State {
  result: number;
}

export enum MessageType {
  CALCULATE,
  RESULT,
  RESET
}

interface BMRParams {
  gender: string;
  height: string;
  weight: string;
  age: string;
}

export interface CalculateMessage {
  type: MessageType.CALCULATE;
  value: BMRParams;
}

export interface ResetMessage {
  type: MessageType.RESET;
}

export type Message = CalculateMessage | ResetMessage;

export default class StateActor extends Actor<Message> {
  private ui = lookup("ui");
  private state: State = {
    result: 0
  };

  async onMessage(msg: Message) {
    switch (msg.type) {
      case MessageType.CALCULATE:
        // men 10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) + 5
        // women 10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) – 161.
        const {
          weight,
          height,
          age,
          gender
        }: BMRParams = msg.value;
        const baseFormulaResult = 10 * +weight + 6.25 * +height - 5 * +age;
        let bmr = 0;
        switch (gender) {
          case "1": // male
              bmr = baseFormulaResult + 5;
            break;
    
          case "0": // female
              bmr = baseFormulaResult - 161;
            break;
          default:
            break;
        }
        this.state.result = bmr;
        break;
      case MessageType.RESET:
        this.state.result = 0;
        break;
    }
    this.ui.send({
      state: this.state
    });
  }
}
