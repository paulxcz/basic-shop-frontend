export const encryptData = (data) => {
  const encoded = btoa(data); // Codificación en Base64 para datos básicos
  return `###${encoded.slice(0, 3)}...${encoded.slice(-3)}###`;
};
