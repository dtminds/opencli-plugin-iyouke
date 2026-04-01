# opencli-plugin-iyouke

> 🔌 An [OpenCLI](https://github.com/jackwener/opencli) plugin — iyouke能力开放插件

## Install

```bash
# Via opencli plugin manager
opencli plugin install github:dtminds/opencli-plugin-iyouke
```

## Update

```bash
opencli plugin update iyouke
```

## Uninstall

```bash
opencli plugin uninstall github:dtminds/opencli-plugin-iyouke
```

## Usage

```bash
# 搜索租户信息
opencli iyouke search --companyAlias 一头牛

# 获取跟进记录列表
opencli iyouke follow-record --uid 40
```

## How It Works

This is a **TS adapter plugin** that internally calls multiple `opencli iyouke` commands.

## Plugin Layout

```
opencli-plugin-iyouke/
├── package.json     # peerDependency on @jackwener/opencli
├── seach.ts     # TS adapter
└── README.md
```

## Requirements

- OpenCLI v1.0.0+

## License

MIT