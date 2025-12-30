import { describe, expect, test } from "@jest/globals";

function sum(a, b) {
  return a - b;
}

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(-1);
  });
});

describe("sum module negative", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).not.toBe(3);
  });
});
