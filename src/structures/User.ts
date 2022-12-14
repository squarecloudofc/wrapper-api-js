import { AccountPlan, RawUserData } from '../typings';
import { Application } from './Application';
import { APIManager } from '../APIManager';
import { Collection } from './Collection';

/**
 * Represents a SquareCloud user
 *
 * @constructor
 * @param apiManager - The APIManager for this user
 * @param data - The data from this user
 */
export class User {
  /** The user's id */
  id: string;
  /** The user's Discord tag */
  tag: string;
  /** The user's current plan */
  plan: AccountPlan;
  /** Whether you have access to private information or not */
  hasAccess: () => this is FullUser;

  #apiManager: APIManager;

  constructor(apiManager: APIManager, data: RawUserData) {
    this.id = data.user.id;
    this.tag = data.user.tag;
    this.plan = {
      ...data.user.plan,
      duration: data.user.plan.duration.formatted,
      purchasedTimestamp: data.user.plan.duration.raw,
      purchased: data.user.plan.duration.raw
        ? new Date(data.user.plan.duration.raw)
        : undefined,
    };
    this.hasAccess = () => data.user.email !== 'Access denied';

    this.#apiManager = apiManager;
  }

  /** Fetches the user data again and returns a new User */
  fetch(): Promise<User> {
    return this.#apiManager
      .user(this.id)
      .then(
        (data) =>
          new (this.hasAccess() ? FullUser : User)(this.#apiManager, data)
      );
  }
}

export class FullUser extends User {
  /** The user's registered email */
  email: string;
  /** The user's registered applications Collection */
  applications = new Collection<string, Application>();

  constructor(apiManager: APIManager, data: RawUserData) {
    super(apiManager, data);

    this.email = data.user.email;

    data.applications.map((app) =>
      this.applications.set(app.id, new Application(apiManager, app))
    );
  }
}
