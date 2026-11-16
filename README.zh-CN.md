# Discord AI 翻译插件

通过你选择的大语言模型 API 翻译 Discord 消息，支持填写自己的 API Key 和模型 ID。

本项目基于 Sehatan 的 AiTranslate-Vencord，由 Ylris 维护本地适配。保留原作者署名和 GPL-3.0-or-later 许可证。[上游项目](https://github.com/Sehatan/AiTranslate-Vencord) · [许可证](LICENSE)

## 功能

- 实时翻译当前频道新收到的消息，默认目标语言为简体中文。
- 发送前翻译自己的消息，默认从简体中文翻译成英语。
- 发送前显示原文和可编辑的译文，按 Enter 或点击“确认发送”后发送。Shift+Enter 换行。取消或关闭预览会保留输入框中的原文。
- 支持 OpenAI、OpenRouter、DeepSeek 等预设服务商以及本机 Ollama、LM Studio。
- 可填写准确的模型 ID，调整 temperature、max tokens，并查看接口返回的 token 用量。
- 支持翻译单条消息、当前可见消息和滚动后出现的消息。
- 默认开启 D&D 术语翻译，使用“法术位”“生命骰”“调整值”等术语，中文译文保留英文法术名。
- 默认参考当前消息之前最多 6 条已加载的同频道文字消息，每条最多 400 字符，用于理解缩写和省略的法术名。可在设置中关闭“参考同频道上下文”。这些文字会一起发送到模型服务商，增加输入 token。
- 发送翻译请求失败时取消本次发送，并显示错误提示。

## 安装到 Mac Discord

需要 Node.js 22 或更高版本、Git 和 pnpm。用户插件需要从源码构建 Vencord。[Vencord 官方安装指南](https://docs.vencord.dev/installing/)

在终端中运行以下命令。

```sh
git clone https://github.com/Vendicated/Vencord.git
cd Vencord
mkdir -p src/userplugins
git clone https://github.com/Ylris/discord-ai-translate.git src/userplugins/AiTranslate
pnpm install --frozen-lockfile
pnpm build --dev
```

接着用 Cmd+Q 完全退出 Discord，再运行以下命令，按照提示选择 Discord 或 Discord PTB 的安装位置。

```sh
pnpm inject
```

如出现 `operation not permitted`，进入系统设置 → 隐私与安全性 → App 管理，开启终端（Terminal）的权限。然后用 Cmd+Q 退出终端，重新打开终端，在 Vencord 目录重试安装。

安装后重新打开 Discord，在用户设置 → Vencord → Plugins 中搜索并启用 `AiTranslate`。

保留 Vencord 源码及其 `dist` 目录，开发版安装会引用构建文件。已有 AiTranslate 安装时，请确认 `src/userplugins` 中只保留一个副本。

## 填写 AI 配置

在 AiTranslate 的设置中按下表填写。

| 项目 | 填写内容 |
| --- | --- |
| API provider | 选择 API 密钥所属的平台 |
| API base URL | 使用预设服务商时留空 |
| API key | 填写该平台申请的 API 密钥 |
| Model | 填写平台提供的模型 ID，留空使用插件预设 |
| Temperature | 默认 0.2 |
| Max tokens | 默认 1024 |

点击 `Test API connection` 测试。显示 `Connection OK` 表示接口有回复。测试和翻译会按服务商规则消耗 token。

桌面 HTTP 桥接支持 `native.ts` 中允许的预设服务商域名以及 localhost。其他远程中转域名需要先修改该文件中的允许列表并重新构建。接口需兼容 `/chat/completions`。

## 设置翻译方向

点击 `Customize translation languages & Auto-Translate`，按下表选择。

| 项目 | 选择 |
| --- | --- |
| Language incoming messages are translated from | Detect language |
| Language incoming messages are translated to | Chinese (Simplified) |
| Language your messages are translated from | Chinese (Simplified) |
| Language your messages are translated to | English |
| Auto Translate | 关闭，以固定使用自己的目标语言 |
| Translate outgoing messages | 开启 |

新安装的默认值已按上述方式配置。已有个人设置时，请在界面确认各项。设置自动保存。

## 日常使用

- 发送消息时，正常输入中文并按发送，插件请求模型翻译后弹出预览，自动聚焦英文编辑框。检查或修改英文，按 Enter 或点击“确认发送”发出译文。Shift+Enter 换行，中文输入法选词时按 Enter 会继续完成输入。点击“取消”、右上角关闭按钮或按 Esc 可取消本次发送，输入框保留原文。
- 点击聊天栏闪电按钮，开启当前频道新消息的实时翻译。Discord 重启后需要重新开启。
- 点击眼睛按钮翻译当前可见消息，循环箭头按钮开启滚动翻译。
- 右键单条消息，选择 `AI Translate` 可单独翻译。

翻译文本直接发送到配置的模型服务商，设置和 API Key 保存在本机 Vencord 设置中。响应速度取决于模型和网络。

## D&D 讨论翻译

设置中的“D&D 术语翻译”和“参考同频道上下文”默认开启。模型会根据原文和上下文区分角色等级与法术环阶，并保留骰式、数值和资源消耗。术语示例包括 Healing Word（治愈真言）、Arcane Vigor（奥术活力）、Hit Dice（生命骰）和 spellcasting ability modifier（施法属性调整值）。

只有上下文明确时才展开 `mod`、`2dx` 等缩写或补全省略的法术名。模型输出仍取决于所选模型的能力。已有译文可通过消息右键菜单中的 `AI Translate` 重新翻译。

## 本版本改动

- 使用当前 Vencord 的 Heading 组件显示语言设置。
- 默认接收翻译为简体中文，默认发送翻译为简体中文到英语。
- 默认开启发送翻译，并在请求失败时取消发送。

已通过桌面开发构建和 TypeScript 检查，并用模拟模型检查发送成功、失败取消、关闭翻译和空消息路径。实际模型效果取决于用户配置的接口。

Vencord 属于第三方客户端修改，Discord 官方政策限制客户端修改，使用存在账号风险。[Discord 官方说明](https://discord.com/safety/platform-manipulation-policy-explainer)
