import {getExePath} from "@pkl-community/pkl"
import {execFile} from "child_process";

export type Options = {
  format?: 'json' | 'jsonnet' | 'pcf' | 'properties' | 'plist' | 'textproto' | 'xml' | 'yaml'
  allowedModules?: string[],
  allowedResources?: string[],
  timeout?: number,
  expression?: string,
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

  if (opts?.expression) {
    args.push("--expression", opts.expression)
  }

  let resolve: (value: PromiseLike<string> | string) => void;
  let reject: (err: Error) => void;
  const out: Promise<string> = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  })

  const process = execFile(getExePath(), args, {
    env: {},
    timeout: opts?.timeout ? (opts?.timeout * 1000) + 100 : undefined,
  }, (err, stdout, stderr) => {
    if (err !== null) {
      reject(new Error(`pkl failed with error ${err} and stderr:\n ${stderr}`));
    } else {
      resolve(stdout)
    }
  });

  await new Promise((resolve, reject) => process.stdin?.write(mod, (error) => {
    if (error) {
      reject(error)
    } else {
      resolve(undefined)
    }
  }));

  await new Promise(((resolve) => process.stdin?.end(resolve)));

  return out;
}
