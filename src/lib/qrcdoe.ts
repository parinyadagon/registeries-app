import qrcode from "qrcode";

export default async function generateQrcode(text: string): Promise<string> {
  let url = `http://localhost:3000/events/${text}/attend`;
  return new Promise(async (resolve, rejects) => {
    await qrcode.toDataURL(url, (err, url) => {
      try {
        resolve(url);
      } catch (e) {
        rejects(e);
      }
    });
  });
}
