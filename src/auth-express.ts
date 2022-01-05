import { Settings, Auth } from 'agil-auth-node';
import { NextFunction, Request, Response } from 'express';
import { ApiRoutesController } from './controllers/api-routes.controller';
import { ApiRoutesSettings } from './interfaces/api-routes-settings.interface';

declare module "express" { 
  export interface Request {
    auth: Auth;
  }
}

export class AuthExpress {

  /**
   * Settings
   */
  public settings: Settings;

  /**
   * Constructor
   */
  constructor(settings: Settings) {
    this.settings = settings;
  }

  /**
   * Resync middleware
   */
  resync() {
    return async (req: Request, _res: Response, next: NextFunction) => {
      req.auth = new Auth(this.settings);

      const authorization = req.header('Authorization');

      if (typeof authorization === 'string' && authorization.length) {
        const [ type, token ] = authorization.split(' ');

        if (type.toLowerCase() === 'bearer' && typeof token === 'string' && token.length) {
          await req.auth.resync(token);
        }
      }

      next();
    };
  }

  /**
   * Api routes
   */
  apiRoutes(apiRoutesSettings?: ApiRoutesSettings) {
    return new ApiRoutesController(this.settings, apiRoutesSettings).router;
  }

  /**
   * Is authenticated middleware
   */
  isAuthenticated() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.auth.check()) {
        next();
      } else {
        res.status(401).json(null);
      }
    };
  }

  /**
   * Is guest middleware
   */
  isGuest() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.auth.check()) {
        next();
      } else {
        res.status(401).json(null);
      }
    };
  }

}
