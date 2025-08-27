import { beforeEach, describe, expect, test } from "vitest";
import QuickList from "./index.js";
import { JSDOM } from "jsdom";

describe("QuickList", () => {
  let form;
  let container;
  let quickList;
  beforeEach(() => {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    globalThis.document = dom.window.document;
    globalThis.window = dom.window;

    form = document.createElement("form");
    form.id = "my-form";
    container = document.createElement("div");
    container.id = "my-container";
  });

  test("should create instance of a QuickList", () => {
    quickList = new QuickList(form, container, "");
    expect(quickList).toBeInstanceOf(QuickList);
  });
  test("container should have an id", () => {
    quickList = new QuickList(form, container, "");
    console.log("quickList", quickList.container);
    expect(container.id).toBe("my-container");
  });
  test("form should have an id", () => {
    quickList = new QuickList(form, container, "groceries");
    console.log({ quickList });
    expect(form.id).toBe("my-form");
  });
});
