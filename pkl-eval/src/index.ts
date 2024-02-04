import {getExePath} from "@pkl-community/pkl"
import {spawn} from "child_process";

export type Options = {
  format?: 'json' | 'jsonnet' | 'pcf' | 'properties' | 'plist' | 'textproto' | 'xml' | 'yaml'
  allowedModules?: string[],
  allowedResources?: string[],
  timeout?: number,
}

export async function evaluate(mod: string, opts?: Options): Promise<string> {
  const args = ["eval", "-", "--no-project"]

  if (opts?.format) {
    args.push("--format", opts.format)
  }

  if (opts?.allowedModules) {
    args.push("--allowed-modules", opts.allowedModules.join(","))
  }

  if (opts?.allowedResources) {
    args.push("--allowed-modules", opts.allowedResources.join(","))
  }

  if (opts?.timeout && opts.timeout > 0) {
    args.push("--timeout", opts.timeout.toString())
  }

  const process = spawn(getExePath(), args, {
    env: {},
    timeout: opts?.timeout ? (opts?.timeout * 1000) + 100 : undefined,
  });

  let out = '';
  let err = '';

  process.stdout.on('data', (data) => {
    out += data.toString();
  });

  process.stderr.on('data', (data) => {
    err += data.toString();
  });

  let close: Promise<string> = new Promise((resolve, reject) => process.on('close', (code) => {
    if (code === null || code === 0) {
      resolve(out)
    } else {
      reject(new Error(`pkl exited with code ${code} and stderr:\n ${err}`))
    }
  }));

  await new Promise((resolve, reject) => process.stdin.write(mod, (error) => {
    if (error) {
      reject(error)
    } else {
      resolve(undefined)
    }
  }));

  await new Promise(((resolve) => process.stdin.end(resolve)));

  return close;
}
