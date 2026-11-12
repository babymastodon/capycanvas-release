import { browserSupport, showGpuNotice } from "./gpu.fb7914993e647ebf1ae5.js";

document.body.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
if (browserSupport().ui) import("./app.0c0f17bc8d10c00b0d00.js");
else {
  document.body.dataset.gpu = "unavailable";
  showGpuNotice({ container: document.getElementById("gpu-notice") });
}
