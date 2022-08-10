import type { NextApiRequest, NextApiResponse } from "next";

import formidable, { File } from "formidable";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};
export type UploadResponse = {
  status: number;
  message: string;
  files: string[];
};
enum fileType {
  image = "images",
  pdf = "files",
}
type ProcessedFiles = Array<[string, File]>;
type FileType = fileType.image | fileType.pdf;

const uploadDir = path.join(process.cwd(), `/public/uploads/`);
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let uploadType = fileType.pdf;
  const files: ProcessedFiles = [];
  await new  Promise<ProcessedFiles | undefined>(
     (resolve, reject) => {
      const form = new formidable.IncomingForm({
        keepExtensions: true,
        multiples: true,
        filter: ({  mimetype })  => {
          return mimetype && mimetype.includes("image")
            ? (uploadType = fileType.image) === fileType.image
            : mimetype && mimetype.includes("pdf")
            ? (uploadType = fileType.pdf) === fileType.pdf
            : false;
        },
        filename: (name, ext, ) => {
          return `${uuidv4()}${ext}`;
        },
      });
      
      form.on("file", function (field, file) {
        files.push([file.newFilename, file]);
      });
      form.on("end", () => resolve(files));
      form.on("error", (err) => reject(err)); 
      form.parse(req);     
      
      
    }
  ).catch((e) => {
    console.log(e);
    res.status(500).json({
      status: 500,
      message: "Upload error",
    });
  });
  await saveFiles(files, uploadType);
  res.status(200).json({
    status: 200,
    message: "Files were uploaded successfully",
    files: files.map((file) => file[0]),
  });
};



async function saveFiles(files: ProcessedFiles, type: FileType) {
  if (files?.length) {    
    /* Create directory for uploads */
    const targetPath = path.join(uploadDir, `${type}/`);
    try {
      await fs.access(targetPath);
    } catch (e) {
      await fs.mkdir(targetPath);
    }
    /* Move uploaded files to directory */    
    for (const file of files) {
      const tempPath = file[1].filepath;      
      try {
        await fs.rename(tempPath, path.join(targetPath, file[0]));
      } catch (e) {
        console.log(e);
      }      
    }
  }
}
export default handler;
