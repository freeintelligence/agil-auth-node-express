import { Auth, Settings } from "agil-auth-node";
import { Router, Request, Response } from "express";
import { ApiRoutesSettings } from "../interfaces/api-routes-settings.interface";
import { Utils } from './../utils';
import bodyParser from 'body-parser';

/**
 * Api routes controller (auth)
 */
export class ApiRoutesController {

  router: Router;
  authSettings: Settings;
  apiRoutesSettings: ApiRoutesSettings;

  constructor(authSettings: Settings, apiRoutesSettings?: ApiRoutesSettings) {
    this.authSettings = authSettings;
    this.apiRoutesSettings = this.fixApiRoutesSettings(apiRoutesSettings);
    this.router = Router();

    this.router.use(bodyParser.urlencoded({ extended: true }));
    this.router.use(bodyParser.json());
    this.router.use(bodyParser.raw());

    if (this.apiRoutesSettings.login.enabled) {
      this.router.post(this.apiRoutesSettings.login.path, this.login.bind(this));
    }

    if (this.apiRoutesSettings.user.enabled) {
      this.router.get(this.apiRoutesSettings.user.path, this.user.bind(this));
    }
  }

  /**
   * Set default values to settings
   */
  private fixApiRoutesSettings(apiRoutesSettings: ApiRoutesSettings) {
    const defaultValues: ApiRoutesSettings = {
      login: {
        enabled: false,
        path: '/login',
        fields: [ 'email', 'password' ],
      },
      user: {
        enabled: true,
        path: '/user',
      }
    };

    return Utils.merge(defaultValues, apiRoutesSettings);
  }

  /**
   * Auth login url
   */
  async login(req: Request, res: Response) {
    const fields: { [key: string]: any } = {};

    this.apiRoutesSettings.login.fields.forEach(fieldName => fields[fieldName] = req.body[fieldName]);

    req.auth = await new Auth(this.authSettings).attempt(fields);

    res.header('Cache-Control', 'no-store');
    res.json({
      check: req.auth.check(),
      user: req.auth.user,
      access: {
        token: req.auth.getCurrentToken().token,
        type: 'Bearer',
        expireAt: req.auth.getCurrentToken().expireAt,
      },
    });
  }

  /**
   * Get current user url
   */
  async user(req: Request, res: Response) {
    if (req.auth.check()) {
      res.status(200).json(req.auth.user);
    } else {
      res.status(401).json(null);
    }
  }

}
