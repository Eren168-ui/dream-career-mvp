import {
  listSelectableRoleCategories,
  listSelectableRolePositions,
} from "../data/roleSystem.js";

export class StaticRoleProvider {
  async listRoles() {
    return listSelectableRoleCategories();
  }

  async listRoleSubcategories() {
    return listSelectableRolePositions();
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
