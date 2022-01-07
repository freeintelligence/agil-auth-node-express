import { Auth, Settings } from "agil-auth-node";
import { Router, Request, Response } from "express";
import { ApiRoutesSettings } from "../interfaces/api-routes-settings.interface";
import { Utils } from './../utils';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

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
    this.authSettings.setMethodCompareAttempt((toCompare: { [key: string]: any }, rawUserData: { [key: string]: any }) => bcrypt.compareSync(toCompare.password, rawUserData.password));

    this.router.use(bodyParser.urlencoded({ extended: true }));
    this.router.use(bodyParser.json());
    this.router.use(bodyParser.raw());

    if (this.apiRoutesSettings.login.enabled) {
      this.router.post(this.apiRoutesSettings.login.path, this.login.bind(this));
    }

    if (this.apiRoutesSettings.user.enabled) {
      this.router.get(this.apiRoutesSettings.user.path, this.user.bind(this));
    }

    if (this.apiRoutesSettings.register.enabled) {
      this.router.post(this.apiRoutesSettings.register.path, this.register.bind(this));
    }

    if (this.apiRoutesSettings.logout.enabled) {
      this.router.delete(this.apiRoutesSettings.logout.path, this.logout.bind(this));
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
        findBy: [ 'username' ],
        compareBy: [ 'password' ],
      },
      user: {
        enabled: true,
        path: '/user',
      },
      register: {
        enabled: false,
        path: '/register',
        fields: [ 'username', 'password' ],
      },
      logout: {
        enabled: true,
        path: '/logout',
      },
    };

    return Utils.merge(defaultValues, apiRoutesSettings);
  }

  /**
   * Auth login url
   */
  async login(req: Request, res: Response) {
    const findBy: { [key: string]: any } = {};
    const compareBy: { [key: string]: any } = {};

    this.apiRoutesSettings.login.findBy.forEach(fieldName => findBy[fieldName] = req.body[fieldName]);
    this.apiRoutesSettings.login.compareBy.forEach(fieldName => compareBy[fieldName] = req.body[fieldName]);

    req.auth = await new Auth(this.authSettings).attempt(findBy, compareBy);

    res.header('Cache-Control', 'no-store');

    if (req.auth.check()) {
      res.status(200).json({
        check: req.auth.check(),
        user: req.auth.user,
        access: {
          token: req.auth.tokens().all()[0].token,
          type: 'Bearer',
          expireAt: req.auth.tokens().all()[0].expireAt,
        },
      });
    } else {
      res.status(401).json({
        check: req.auth.check(),
        user: null,
        access: null,
      });
    }
  }

  /**
   * Register user
   */
  async register(req: Request, res: Response) {

  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response) {
    
  }

  /**
   * Get current data user
   */
  async user(req: Request, res: Response) {
    if (req.auth.check()) {
      res.status(200).json(req.auth.user);
    } else {
      res.status(401).json(null);
    }
  }

}
