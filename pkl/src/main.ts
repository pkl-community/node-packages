#!/usr/bin/env node

import { spawnSync } from "child_process";
import {getExePath} from "./index";

function run() {
  const args = process.argv.slice(2);
  const processResult = spawnSync(getExePath(), args, { stdio: "inherit" });
  process.exit(processResult.status ?? 0);
}

run();
