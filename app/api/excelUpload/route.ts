import multer from "multer";

import * as nextConnect from "next-connect";

const uploadMiddleware = multer({ dest: "./" });

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({});
