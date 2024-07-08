export const formatPdfBase64 = (base64: string) => {
  return base64.replace(/[\r\n\\]/g, "");
};

export const getOriginalPDF = (base64: string) => {
  const formatPdfBase64 = base64.replace(/[\r\n\\]/g, "");
  const blob = new Blob([Buffer.from(formatPdfBase64, "base64")], {
    type: "application/pdf",
  });
  window.open(window.URL.createObjectURL(blob));
};
