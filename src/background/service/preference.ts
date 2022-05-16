import eventBus from '@/eventBus';

const version = process.env.release || '0';

export interface Account {
  type: string;
  address: string;
  brandName: string;
  alianName?: string;
  displayBrandName?: string;
  index?: number;
  balance?: number;
}

class PreferenceService {
}

export default new PreferenceService();
