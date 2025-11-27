import { Request, Response, NextFunction } from 'express'

export const asyncHandler =
  <R extends Request>(
    fn: (req: R, res: Response, next: NextFunction) => Promise<any>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as R, res, next)).catch(next)
  }
