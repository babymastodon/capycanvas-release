import { browserSupport, showGpuNotice } from "./gpu.29158515ce4ca040eae2.js";

if (browserSupport().ui) import("./app.3d30ed99a4d812c29931.js");
else {
  document.body.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.body.dataset.gpu = "unavailable";
  showGpuNotice({ container: document.getElementById("gpu-notice") });
}
