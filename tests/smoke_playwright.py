from playwright.sync_api import expect, sync_playwright


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1800})

    # 首页 Demo 入口
    page.goto("http://127.0.0.1:4173", wait_until="networkidle")
    expect(page.get_by_text("梦想职业测评 Demo 画廊")).to_be_visible()
    expect(page.get_by_role("link", name="进入正式流程")).to_be_visible()

    # 正式流程：/start -> /assessment -> /result -> /report
    page.get_by_role("link", name="进入正式流程").click()
    page.wait_for_url("**/start")

    page.get_by_role("button", name="产品经理").click()
    page.get_by_role("button", name="有明确目标，不知道怎么行动").click()
    page.get_by_label("专业名称 *").fill("信息管理与信息系统")
    page.get_by_label("预计毕业年份 *").select_option("2028")
    page.get_by_label("学历 *").select_option("bachelor")
    page.get_by_label("就读区域 *").select_option("domestic")
    page.get_by_label("简历现状 *").select_option("draft_resume")
    page.get_by_label("目标公司（选填）").fill("字节跳动")
    page.get_by_role("button", name="开始评估").click()

    page.wait_for_url("**/assessment")
    page.wait_for_timeout(500)
    expect(page.get_by_text("共 4 题，根据你的实际情况如实选择")).to_be_visible()

    questions = page.locator(".question-block")
    for index in range(questions.count()):
        questions.nth(index).locator(".option-btn").nth(2).click(force=True)

    expect(page.get_by_role("button", name="提交，查看结果")).to_be_enabled()
    page.get_by_role("button", name="提交，查看结果").click()
    page.wait_for_url("**/result")
    expect(page.get_by_text("自我认知")).to_be_visible()
    expect(page.get_by_text("外界认知")).to_be_visible()
    expect(page.get_by_text("行动指引")).to_be_visible()
    expect(page.get_by_text("结尾寄语")).to_be_visible()

    page.reload(wait_until="networkidle")
    expect(page.get_by_text("自我认知")).to_be_visible()
    expect(page.get_by_role("button", name="查看完整简历诊断报告")).to_be_visible()

    page.get_by_role("button", name="查看完整简历诊断报告").click()
    page.wait_for_url("**/report")
    page.wait_for_timeout(500)
    expect(page.get_by_text("简历升级诊断报告")).to_be_visible()
    expect(page.get_by_text("当前简历问题诊断")).to_be_visible()
    expect(page.get_by_text("岗位要求拆解")).to_be_visible()
    expect(page.get_by_text("下一步行动")).to_be_visible()

    page.reload(wait_until="networkidle")
    expect(page.get_by_text("简历升级诊断报告")).to_be_visible()

    # Demo 结果页与报告页
    page.goto("http://127.0.0.1:4173/demo/demo-sophomore-product-manager/results", wait_until="networkidle")
    expect(page.get_by_text("演示档案")).to_be_visible()
    expect(page.get_by_text("自我认知")).to_be_visible()

    page.goto("http://127.0.0.1:4173/demo/demo-sophomore-product-manager/report", wait_until="networkidle")
    expect(page.get_by_text("演示诊断报告")).to_be_visible()
    expect(page.get_by_text("从测评结果到简历升级")).to_be_visible()
    expect(page.get_by_text("案例分析")).to_be_visible()

    browser.close()
