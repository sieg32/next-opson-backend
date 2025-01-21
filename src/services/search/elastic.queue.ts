import Bull from 'bull'

import { ElasticsearchHelper } from './helper.service'


const esQueue = new Bull('elasticsearch', {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
  });
  
  // Process jobs in the queue
  esQueue.process(async (job) => {
    const { action, data } = job.data;
    try {
      switch (action) {
        case 'add':
          await ElasticsearchHelper.addProperty(data);
          break;
        case 'updateProperty':
          await ElasticsearchHelper.updateProperty(data.propertyId, data.updates);
          break;
        case 'updateLocation':
          await ElasticsearchHelper.updateLocation(data.propertyId, data.updates);
          break;
        case 'updateImages':
          await ElasticsearchHelper.updateImages(data.propertyId);
          break;
        case 'delete':
          await ElasticsearchHelper.deleteProperty(data.propertyId);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      console.log(`${action} operation completed for property`);
    } catch (error) {
      console.error(`Failed to process ${action} job:`, error.message);
    }
  });

  export {esQueue};