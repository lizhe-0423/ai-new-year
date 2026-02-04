import { CoupletRequest, CoupletResponse, FortuneCard } from '../types';

export const generateCouplet = async (req: CoupletRequest): Promise<CoupletResponse> => {
  try {
    const response = await fetch('/api/couplet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Couplet generation failed:', e);
    throw new Error('生成失败，请重试');
  }
};

export const generateFortune = async (): Promise<FortuneCard> => {
  try {
    const response = await fetch('/api/fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Fortune generation failed:', e);
    throw new Error('求签失败，请心诚则灵(重试)');
  }
};
