window.pdfjsReady = import("./node_modules/pdfjs-dist/legacy/build/pdf.min.mjs")
  .then((pdfjsLib) => {
    window.pdfjsLib = pdfjsLib;
    return pdfjsLib;
  })
  .catch((error) => {
    console.error("PDF.js could not be loaded.", error);
    return null;
  });
