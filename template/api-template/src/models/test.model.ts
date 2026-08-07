import type { Model } from '@core/db';
import { initModel } from './pool';

const TABLE = 'test';
const table: Model = initModel(TABLE);
export default table;
