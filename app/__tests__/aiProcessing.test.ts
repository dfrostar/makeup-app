import { detectIntent } from '../utils/ai';

describe('AI Processing', () => {
  test('should detect task creation intent', async () => {
    const response = await detectIntent('Remind me to buy milk');
    expect(response.type).toBe('task_create');
  });
  
  test('should detect task deletion intent', async () => {
    const response = await detectIntent('Delete the shopping task');
    expect(response.type).toBe('task_delete');
  });
  
  test('should detect task update intent', async () => {
    const response = await detectIntent('Update my homework task');
    expect(response.type).toBe('task_update');
  });
  
  test('should handle general chat', async () => {
    const response = await detectIntent('Hello, how are you?');
    expect(response.type).toBe('general_chat');
  });
}); 