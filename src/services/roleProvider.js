import { roleSubcategories, roles } from "../data/roles.js";

export class StaticRoleProvider {
  async listRoles() {
    return roles;
  }

  async listRoleSubcategories() {
    return roleSubcategories;
  }
}

export class PlaceholderRoleCrawlerProvider {
  async syncRoles() {
    throw new Error("Crawler provider is not enabled in MVP. Use static role data by default.");
  }
}

export function createRoleProvider() {
  return new StaticRoleProvider();
}
