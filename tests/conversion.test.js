import test from "node:test";
import assert from "node:assert/strict";

import { buildConversionSearch, readConversionContext } from "../src/lib/conversion.js";

test("buildConversionSearch serializes role, company and source context", () => {
  const search = buildConversionSearch({
    profile: {
      targetRole: "product-manager",
      targetCompany: "字节跳动",
    },
    sourcePath: "/demo/demo-sophomore-product-manager/results",
  });

  assert.match(search, /role=product-manager/);
  assert.match(search, /company=%E5%AD%97%E8%8A%82%E8%B7%B3%E5%8A%A8/);
  assert.match(search, /source=%2Fdemo%2Fdemo-sophomore-product-manager%2Fresults/);
});

test("readConversionContext resolves role name and keeps source metadata", () => {
  const context = readConversionContext("?role=strategy-consulting&company=%E8%B4%9D%E6%81%A9%E5%92%A8%E8%AF%A2&source=%2Freport");

  assert.equal(context.roleId, "strategy-consulting");
  assert.equal(context.roleName, "战略咨询");
  assert.equal(context.company, "贝恩咨询");
  assert.equal(context.source, "/report");
});
