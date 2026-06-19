import { axiosInstance } from "../lib/axios";

export async function downloadCertificate(certId: string) {
  const res = await axiosInstance.get(`/certificates/${certId}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `certificate-${certId}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}