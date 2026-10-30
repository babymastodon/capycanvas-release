import {createWorkspaceClient} from "./workspace-store.7ccde0a02d0dc2bd0121.js";

// This small entry point can run before the editor's full module graph loads.
// Start storage's isolate and compile the shared Wasm module in that interval.
let wake = () => {};
export const workspaceStore = createWorkspaceClient(new URL("./workspace-worker.4116a153f018e5bae04e.js", import.meta.url), {
  preload: true, onSettled: () => wake(),
});
export const setWorkspaceWake = callback => { wake = callback; };
export const modulePromise = (async () => {
  const response = await fetch(new URL("./pkg/layer_web_bg.1ba467d8e464fe7f6faf.wasm", import.meta.url));
  if (!response.ok) throw new Error("Cannot load application code");
  return response.headers.get("Content-Type")?.split(";")[0] === "application/wasm"
    ? WebAssembly.compileStreaming(response)
    : WebAssembly.compile(await response.arrayBuffer());
})();
// The editor reports failures after its imports load, even if this rejects first.
modulePromise.catch(() => {});
