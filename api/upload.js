import formidable from "formidable";
import fs from "fs-extra";
import path from "path";
import { nanoid } from "nanoid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    multiples: false,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.video;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const id = nanoid(6);
    const ext = path.extname(file.originalFilename);
    const fileName = id + ext;

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await fs.ensureDir(uploadsDir);

    const newPath = path.join(uploadsDir, fileName);
    await fs.move(file.filepath, newPath);

    res.status(200).json({
      watchUrl: `/v/${id}`,
      directUrl: `/uploads/${fileName}`
    });
  });
             }
