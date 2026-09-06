let pdfjsLoadingPromise = null;

window.loadPdfJs = function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (!pdfjsLoadingPromise) {
    pdfjsLoadingPromise = import("./node_modules/pdfjs-dist/legacy/build/pdf.min.mjs")
      .then((pdfjsLib) => {
        window.pdfjsLib = pdfjsLib;
        return pdfjsLib;
      })
      .catch((error) => {
        pdfjsLoadingPromise = null;
        console.error("PDF.js could not be loaded.", error);
        return null;
      });
  }
  return pdfjsLoadingPromise;
};
