import {Client} from '@elastic/elasticsearch'
import config from './config';

const elastic = new Client({
    node: 'http://localhost:9200', // Replace with your Elasticsearch server URL
    auth: {
      username: config.elastic.USER,       // Replace with your Elasticsearch username
      password: config.elastic.PASSWORD , // Replace with your password
    },
  });


  async function testConnection() {
    try {
      const response = await elastic.info();
      console.log('Elasticsearch is connected:', response);
    } catch (error) {
      console.error('Elasticsearch connection error:', error);
    }
  }
  
  testConnection();


  export default elastic;