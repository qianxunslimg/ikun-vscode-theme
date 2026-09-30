# IKUN Club · 背带裤与篮球

**把梗画进图标，把空间留给代码。**

一套完全离线的 VS Code 主题。中分小鸡、背带裤口袋、语言球衣、篮球终端——使用统一的矢量轮廓和低饱和配色，不铺壁纸、不弹窗、不自动播放。

![真实 VS Code 深色预览](docs/previews/workbench-dark.png)

## 图标有梗，也有用

- 文件夹是背带裤口袋；展开后口袋打开。源码、文档、测试目录各有不同标记。
- JS / TS / Python / Go / Rust 等代码文件是语言球衣，字母由矢量路径绘制，不依赖字体。
- Shell 脚本是篮球和终端提示符。支持 sh、bash、zsh、fish、ps1、bat、cmd 及常见 shell 配置文件。
- 配置是战术板，测试文件是篮筐，图片是中分小鸡拍立得，音频是麦克风。
- README、AGENTS.md、CLAUDE.md 使用中分小鸡；锁文件、包文件、Git 和数据库保留明确用途标识。
- 活动栏资源管理器是背带口袋，运行调试是篮球，账号是中分小鸡。

![图标对照：32px 与 16px，深浅色](docs/previews/icon-atlas.png)

共 48 种图标造型，分别输出深色和浅色版本；覆盖 74 个文件后缀规则。测试篮筐是文件类型图标，不代表测试执行状态。

## 三套外观

| 配色 | 视觉 |
| --- | --- |
| 背带裤黑 | 炭黑、暖白、篮球橙 |
| 球场白 | 纸白、石墨、焦糖橙 |
| 舞台夜 | 墨紫、银灰、柔橙 |

## 安装与切换

在扩展视图菜单选择 **从 VSIX 安装**，安装 `ikun-vscode-theme-0.2.0.vsix`。

命令面板执行 **IKUN: 启用日常套装**，或 **IKUN: 打开主题衣柜** 选择配色。原来的 `ikun.openClub` 命令 ID 保持兼容。

![主题衣柜](docs/previews/wardrobe.png)

套装更新当前用户 Profile 的颜色、文件图标和产品图标。第一次应用时保存原全局值；**IKUN: 恢复之前的外观** 只恢复仍属于 IKUN 的设置，不覆盖后来手动选择的其他主题。工作区覆盖设置仍优先。

仅改颜色可用 VS Code 自带的“首选项: 颜色主题”；文件和产品图标也可分别选择。更新安装后执行 **Developer: Reload Window**。

没有云服务、账号、遥测、素材导入、背景注入和合成音效。不会修改 VS Code 安装文件。

## 开发和验证

```sh
npm ci
npm run build
npm run check
npm test
npm run test:visual
npm run package
```

视觉检查需要 Chromium：`npx playwright install chromium`，或用 `IKUN_CHROME` 指定浏览器路径。按 F5 启动扩展开发窗口。`test/host.cjs` 可通过 VS Code 的 `--extensionTestsPath` 运行真实扩展宿主检查。

颜色源文件：`scripts/build.mjs`；原创图标：`scripts/build-icons.mjs`。产品图标字体已经提交，普通构建不需要 Python。修改 `assets/product/*.svg` 后，可用 `fonttools` + `brotli` 执行 `python3 scripts/build-product-font.py` 重新生成。

素材参考见 [资源调研](docs/RESOURCES.md) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。非官方粉丝作品。
