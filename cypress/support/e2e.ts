/**
 * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file
 */
import {
  addVrtTrackCommand,
  addVrtStartCommand,
  addVrtStopCommand,
} from "../../lib/commands";

addVrtStartCommand();
addVrtStopCommand();
addVrtTrackCommand();
