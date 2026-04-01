import { cli, Strategy } from '@jackwener/opencli/registry';
import type { IPage } from '@jackwener/opencli/types';

interface BoardData {
  showDate: boolean;
  startDate: string;
  endDate: string;
  startDateShow: string;
  endDateShow: string;
  data: Record<string, unknown>[];
  demoData: null;
  dataModel: Record<string, string>;
  groupModel: string[];
  indexModel: string[];
  dateFlag: null;
  dateType: string;
  dateList: null;
  showSelectList: string[];
  sql: null;
}

interface ModuleInfo {
  name: string;
  originalName: string;
  moduleType: number;
  timeType: string;
  timeParams: string[];
  chartType: string;
  windowType: string;
  note: string;
}

cli({
  site: 'iyouke',
  name: 'ai-analysis-search-data',
  description: 'AI分析指标数据（动态指标字段）',
  domain: 'smp.iyouke.com',
  strategy: Strategy.HEADER,
  navigateBefore: 'https://smp.iyouke.com',
  browser: true,
  args: [
    { name: 'indexId', type: 'int', default: 1, help: '指标ID' },
  ],
  columns: ['date_time', '指标值', '指标名', '指标说明'],
  func: async (page: IPage, kwargs: Record<string, unknown>) => {
    const body = {
      indexId: kwargs.indexId ?? 1,
    };

    const result = await page.evaluate(`
      (async () => {
        const getCookie = (name) => {
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? decodeURIComponent(match[2]) : '';
        };
        const token = getCookie('token') || '';
        const body = ${JSON.stringify(body)};
        const res = await fetch('https://smp-api.iyouke.com/cdp-new/api/ai/intellect/aiAnalysisSearchData', {
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

    const boardData = result.data?.boardData as BoardData | null;
    const moduleInfo = result.data?.moduleInfo as ModuleInfo | null;
    const dataModel = boardData?.dataModel || {};
    const indexModel = boardData?.indexModel || [];
    const records = boardData?.data || [];

    // 动态获取指标字段名（排除 date_time）
    const metricKey = (indexModel.filter((k: string) => k !== 'date_time')?.[0]) || 'value';
    const metricName = dataModel[metricKey] || metricKey;

    // 按日期返回数据，每行包含日期、指标值、指标名、说明
    return records.map((r: Record<string, unknown>) => ({
      date_time: r.date_time || '',
      '指标值': r[metricKey] ?? 0,
      '指标名': metricName,
      '指标说明': moduleInfo?.note || '',
    }));
  },
});
