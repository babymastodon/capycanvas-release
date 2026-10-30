import { browserSupport, showGpuNotice } from "./gpu.29158515ce4ca040eae2.js";

if (browserSupport().ui) import("./app.d6b178d0415caf0fdfbf.js");
else {
  document.body.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.body.dataset.gpu = "unavailable";
  showGpuNotice({ container: document.getElementById("gpu-notice") });
}
