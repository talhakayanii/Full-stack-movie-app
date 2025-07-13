import { Response } from 'express';

interface ResponseData {
  success: boolean;
  message: string;
  errors?: any;
  data?: any;
}

export const sendResponse = (res: Response, { success, message, errors, data }: ResponseData) => {
  res.status(success ? 200 : 400).json({
    success,
    message,
    errors,
    data,
  });
};
