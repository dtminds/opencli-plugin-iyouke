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
opencli plugin uninstall iyouke
```

## Usage

```bash
# 查询AI分析支持的指标列表
opencli iyouke ai-analysis-metric-index --indexName 

```

## How It Works

This is a **TS adapter plugin** that internally calls multiple `opencli iyouke` commands.

## Plugin Layout

```
opencli-plugin-iyouke/
├── package.json     # peerDependency on @jackwener/opencli
├── ai-analysis-metric-index.ts     # TS adapter
└── README.md
```

## Requirements

- OpenCLI v1.0.0+

## License

MIT