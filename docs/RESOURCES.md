# 资源调研与设计边界

检索日期：2026-09-30。范围为 Marketplace、GitHub、官方 VS Code API 和公开素材库，不声称覆盖全网。

| 来源 | 内容 | 本项目处理 |
| --- | --- | --- |
| [坤坤鼓励师](https://marketplace.visualstudio.com/items?itemName=sakura1357.cxk) | 休息提醒和篮球舞 | 功能参考，不复制素材或定时弹窗 |
| [DeepSeek IKUN 皮肤](https://github.com/AKS1st/ikun-theme-skin) | 配色、壁纸、音乐盒、角色 | 创意参考；不采用大背景、真人照片或远程热链 |
| [CXK Basketball](https://github.com/kasuganosoras/cxk-ball) | 篮球互动 | 参考互动方向，不打包原项目素材 |
| [ChineseBQB](https://github.com/zhaoolee/ChineseBQB) | 包括蔡徐坤分类的表情包集合 | 供发现梗图；单张来源、真人成分与授权不统一，未打包 |
| [Phosphor core](https://github.com/phosphor-icons/core) | SVG 图标 | MIT，使用并保留许可 |
| [Phosphor web](https://github.com/phosphor-icons/web) | 图标字体 | MIT，使用并保留许可 |
| [VS Code 主题能力](https://code.visualstudio.com/api/extension-capabilities/theming) | 颜色、文件图标、产品图标 | 三种官方贡献点 |
| [Webview](https://code.visualstudio.com/api/extension-guides/webview) | 独立交互面板 | 本地资源、CSP、显式播放 |

最终采用原创动漫小贴纸，不采用真人素材。首轮大幅主视觉因用户要求“不要大片背景”而弃用，不打包。贴纸生成提示见 THIRD_PARTY_NOTICES.md。

颜色主题只能提供颜色和语法样式，不能通过官方主题接口为编辑区任意铺设动态图。第一版不修改 VS Code 安装文件，不注入 workbench CSS。所有互动在练习室中完成。
