import { test, expect } from "playwright/test";

test("main MVP flow works end-to-end", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "职业测试引流独立新系统 MVP" })).toBeVisible();

  await page.getByRole("button", { name: "开始测评" }).click();
  await page.waitForURL("**/assessment/setup");
  await expect(page.getByRole("heading", { name: "测试导航页 / 测前建档" })).toBeVisible();

  await page.getByLabel("理想岗位 *").selectOption("product-manager");
  await page.getByLabel("理想公司").fill("腾讯");
  await page.getByLabel("毕业年份 *").selectOption("2028");
  await page.getByLabel("专业名称 *").fill("信息管理与信息系统");
  await page.getByLabel("简历阶段 *").selectOption("draft_resume");
  await page.getByLabel("职业阶段 *").selectOption("clear_goal_no_action");
  await page.getByLabel("学历 *").selectOption("bachelor");
  await page.getByLabel("就读区域 *").selectOption("domestic");
  await page.getByRole("button", { name: "保存并进入题目页" }).click();

  await page.waitForURL("**/assessment/questions");
  await expect(page.getByRole("heading", { name: "题目页" })).toBeVisible();

  const radios = page.locator('input[type="radio"][value="often"]');
  const count = await radios.count();
  for (let index = 0; index < count; index += 1) {
    await radios.nth(index).check({ force: true });
  }

  await page.getByRole("button", { name: "生成结果" }).click();
  await page.waitForURL("**/assessment/result");
  await expect(page.getByRole("heading", { name: "结果页" })).toBeVisible();
  await expect(page.getByText("维度得分与分级")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载结果图" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain(".svg");

  await page.getByRole("button", { name: "去简历升级页" }).click();
  await page.waitForURL("**/resume-upgrade");
  await expect(page.getByRole("heading", { name: "简历升级页" })).toBeVisible();

  await page.getByLabel("联系方式 *").fill("wechat: smoke-test");
  await page.getByRole("button", { name: "免费留资获取完整报告" }).click();
  await expect(page.getByText("已记录留资信息")).toBeVisible();

  const link = page.getByRole("link", { name: "跳转原有简历批注工具（只读跳转）" });
  await expect(link).toHaveAttribute("href", "https://resume.erenlab.cn");
});
