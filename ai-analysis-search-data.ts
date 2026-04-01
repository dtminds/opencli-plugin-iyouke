import { cli, Strategy } from '@jackwener/opencli/registry';
import type { IPage } from '@jackwener/opencli/types';

interface BoardDataItem {
  date_time: string;
  customer_cnt: number;
  date_time_show: string;
}

interface BoardData {
  showDate: boolean;
  startDate: string;
  endDate: string;
  startDateShow: string;
  endDateShow: string;
  data: BoardDataItem[];
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
  boardId: null;
  boardModuleId: null;
  moduleId: null;
  name: string;
  originalName: string;
  moduleType: number;
  subModuleType: null;
  timeType: string;
  timeParams: string[];
  showCondition: null;
  moduleJson: Record<string, unknown>;
  chartType: string;
  windowType: string;
  coordinate: string;
  note: string;
  ctime: null;
  dataJson: null;
}

interface AvaliableDim {
  dimId: number;
  dimName: string;
  dimDesc: string;
}

cli({
  site: 'iyouke',
  name: 'ai-analysis-search-data',
  description: 'AI分析指标数据',
  domain: 'smp.iyouke.com',
  strategy: Strategy.HEADER,
  navigateBefore: 'https://smp.iyouke.com',
  browser: true,
  args: [
    { name: 'indexId', type: 'int', default: 1, help: '指标ID' },
  ],
  columns: ['date_time', 'customer_cnt', 'indexName', 'note'],
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
    const records = boardData?.data ?? [];
    return records.map((r) => ({
      date_time: r.date_time || '',
      customer_cnt: r.customer_cnt ?? 0,
      indexName: moduleInfo?.name || '',
      note: moduleInfo?.note || '',
    }));
  },
});
