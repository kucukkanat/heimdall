/**
 * @jest-environment jsdom
 */
describe("Heimdall", () => {
  test("test test", () => {
    console.log({ window });
    expect(true).toBe(true);
  });
});
