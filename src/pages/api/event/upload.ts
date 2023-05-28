import formidable, { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = `${path.join(process.cwd(), "public", "uploads")}`;
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }

  const form = new IncomingForm(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await fs.readdir(path.join(process.cwd(), "public", "uploads"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd(), "public", "uploads"));
  }

  const { files } = await readFile(req, true);

  res.status(200).json({
    message: "success",
    files: files.file,
  });
}
