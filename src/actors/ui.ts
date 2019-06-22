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

import { State, MessageType as StateMessageType } from "./state.js";

declare global {
  interface ActorMessageType {
    ui: Message;
  }
}

export interface StateMessage {
  state: State;
}

export type Message = StateMessage;

export default class UiActor extends Actor<Message> {
  private state = lookup("state");
  private resultEl = document.getElementById("result") as HTMLSpanElement;
  private getInputVal = () => {
    // gender
    const genderEl = document.getElementById("gender") as HTMLSelectElement;
    const genderVal = genderEl.value;
    // height
    const heightEl = document.getElementById("height") as HTMLSelectElement;
    const heightVal = heightEl.value;
    // weight
    const weightEl = document.getElementById("weight") as HTMLSelectElement;
    const weightVal = weightEl.value;
    // age
    const ageEl = document.getElementById("age") as HTMLSelectElement;
    const ageVal = ageEl.value;
    return {
      gender: genderVal,
      height: heightVal,
      weight: weightVal,
      age: ageVal,
    }
  };
  
  async init() {
    const calculateButton = document.getElementById(
      "Calculate"
    ) as HTMLButtonElement;
    calculateButton.onclick = () =>
      this.state.send({
        type: StateMessageType.CALCULATE,
        value: this.getInputVal()
      });

    const resetButton = document.getElementById(
      "Reset"
    ) as HTMLButtonElement;
    resetButton.onclick = () => {
      const form = document.getElementById("bmrForm") as HTMLFormElement;
      form.reset();
      this.state.send({
        type: StateMessageType.RESET
      });
    }
  }

  async onMessage(msg: Message) {
    this.resultEl.textContent = `${msg.state.result}`;
  }
}
