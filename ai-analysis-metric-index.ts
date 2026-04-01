import { cli, Strategy } from '@jackwener/opencli/registry';
import type { IPage } from '@jackwener/opencli/types';

interface FilterEnum {
  code: string;
  value: string;
}

interface Filter {
  filterId: number;
  filterName: string;
  filterDesc: string;
  filterEnumList: FilterEnum[];
}

interface Dim {
  dimId: number;
  dimName: string;
  dimDesc: string;
}

interface IndexItem {
  indexId: number;
  indexName: string;
  indexDesc: string;
  timeTypeList: string[];
  dimList: Dim[];
  filterList: Filter[];
}

cli({
  site: 'iyouke',
  name: 'ai-analysis-metric-index',
  description: 'AI分析指标列表',
  domain: 'smp.iyouke.com',
  strategy: Strategy.HEADER,
  navigateBefore: 'https://smp.iyouke.com',
  browser: true,
  args: [
    { name: 'indexName', type: 'string', default: '', help: '指标名称（模糊搜索）' },
  ],
  columns: ['indexId', 'indexName', 'indexDesc', 'timeTypeList', 'dimList', 'filterList'],
  func: async (page: IPage, kwargs: Record<string, unknown>) => {
    const body = {
      indexName: kwargs.indexName ?? '',
    };

    const result = await page.evaluate(`
      (async () => {
        const getCookie = (name) => {
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? decodeURIComponent(match[2]) : '';
        };
        const token = getCookie('token') || '';
        const body = ${JSON.stringify(body)};
        const res = await fetch('https://smp-api.iyouke.com/cdp-new/api/ai/intellect/aiAnalysisMetricIndex', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + decodeURIComponent(token)
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          return { error: 'HTTP ' + res.status, data: null };
        }

        return res.json();
      })()
    `);

    if (!result || result.code !== '0') {
      throw new Error(`API错误: ${result?.msg ?? '未知错误'}`);
    }

    const records = (result.data?.indexList ?? []) as IndexItem[];
    return records.map((r) => ({
      indexId: r.indexId,
      indexName: r.indexName || '',
      indexDesc: r.indexDesc || '',
      timeTypeList: r.timeTypeList?.join(',') || '',
      dimList: r.dimList?.map(d => d.dimName).join(',') || '',
      filterList: r.filterList?.map(f => f.filterName).join(',') || '',
    }));
  },
});
