import { browserSupport, showGpuNotice } from "./gpu.32ab7c11aa13321808bf.js";

document.body.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
if (browserSupport().ui) import("./app.36a030adc131976f48fe.js");
else {
  document.body.dataset.gpu = "unavailable";
  showGpuNotice({ container: document.getElementById("gpu-notice") });
}
