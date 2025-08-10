import { beforeEach, describe, expect, test } from "vitest";
import Listly from "./index.mjs";
import { JSDOM } from "jsdom";

describe("Listly", () => {
  let form;
  let container;
  let listly;
  beforeEach(() => {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    globalThis.document = dom.window.document;
    globalThis.window = dom.window;

    form = document.createElement("form");
    form.id = "my-form";
    container = document.createElement("div");
    container.id = "my-container";
  });

  test("should create instance of a Listly", () => {
    listly = new Listly(form, container, "");
    expect(listly).toBeInstanceOf(Listly);
  });
  test("container should have an id", () => {
    listly = new Listly(form, container, "");
    console.log("listly", listly.container);
    expect(container.id).toBe("my-container");
  });
  test("listly should have a unique name", () => {
    listly = new Listly(form, container, "groceries");
    console.log({ listly });
    expect(listly.listName).toBe("groceries");
  });
  test("form should have an id", () => {
    listly = new Listly(form, container, "groceries");
    console.log({ listly });
    expect(form.id).toBe("my-form");
  });
});
