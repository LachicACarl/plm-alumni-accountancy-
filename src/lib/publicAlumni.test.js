import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { fetchAllPublicAlumni } from "./publicAlumni.js";

function createClient(pages, calls = []) {
  return {
    rpc(name) {
      calls.push({ method: "rpc", name });
      return {
        order(column, options) {
          calls.push({ method: "order", column, options });
          return {
            async range(from, to) {
              calls.push({ method: "range", from, to });
              const page = pages.shift();
              if (page instanceof Error) return { data: null, error: page };
              return { data: page, error: null };
            },
          };
        },
      };
    },
  };
}

describe("fetchAllPublicAlumni", () => {
  test("loads ordered pages until the final short page", async () => {
    const calls = [];
    const client = createClient([[{ id: "a" }, { id: "b" }], [{ id: "c" }]], calls);
    const result = await fetchAllPublicAlumni({ pageSize: 2, client });
    assert.deepEqual(result, [{ id: "a" }, { id: "b" }, { id: "c" }]);
    assert.equal(calls.filter((call) => call.method === "rpc").length, 2);
    assert.deepEqual(calls.filter((call) => call.method === "order")[0], {
      method: "order", column: "id", options: { ascending: true },
    });
    assert.deepEqual(calls.filter((call) => call.method === "range"), [
      { method: "range", from: 0, to: 1 },
      { method: "range", from: 2, to: 3 },
    ]);
  });

  test("throws rather than silently returning a truncated result at the page cap", async () => {
    const client = createClient([[{ id: "a" }], [{ id: "b" }], [{ id: "c" }]]);
    await assert.rejects(
      fetchAllPublicAlumni({ pageSize: 1, maxPages: 2, client }),
      /exceeded the safety limit of 2 pages/
    );
  });

  test("propagates RPC errors", async () => {
    const error = new Error("permission denied");
    const client = createClient([error]);
    await assert.rejects(fetchAllPublicAlumni({ client }), (actual) => actual === error);
  });

  test("rejects invalid pagination settings", async () => {
    const client = createClient([]);
    await assert.rejects(fetchAllPublicAlumni({ pageSize: 0, client }), RangeError);
    await assert.rejects(fetchAllPublicAlumni({ pageSize: 1001, client }), RangeError);
    await assert.rejects(fetchAllPublicAlumni({ maxPages: 0, client }), RangeError);
  });
});
