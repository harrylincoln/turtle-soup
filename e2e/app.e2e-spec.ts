import { Angular2DepTestPage } from './app.po';

describe('angular2-dep-test App', () => {
  let page: Angular2DepTestPage;

  beforeEach(() => {
    page = new Angular2DepTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
