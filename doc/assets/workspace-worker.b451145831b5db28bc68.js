import init, {workspace_database} from "./pkg/layer_web.7fb58a3b8c245a0ce7b2.js";
import {createWorkspaceStore} from "./workspace-store.4f34a0720efe21e7a0af.js";
let ready;
const store = createWorkspaceStore(workspace_database);
self.onmessage = async ({data}) => {
  if (data.module) { ready = init({module_or_path:data.module}); return; }
  try { await (ready ||= init()); self.postMessage({id:data.id,response:await store.execute(data.request)}); }
  catch(error) { self.postMessage({id:data.id,error:typeof error === "string" ? error : JSON.stringify({kind:"unavailable",message:String(error)})}); }
};
