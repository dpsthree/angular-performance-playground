import { PerformanceAppPage } from './app.po';

describe('performance-app App', () => {
  let page: PerformanceAppPage;

  beforeEach(() => {
    page = new PerformanceAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
