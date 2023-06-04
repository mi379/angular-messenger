import { IsFailedSendPipe } from './is-failed-send.pipe';

describe('IsFailedSendPipe', () => {
  it('create an instance', () => {
    const pipe = new IsFailedSendPipe();
    expect(pipe).toBeTruthy();
  });
});
