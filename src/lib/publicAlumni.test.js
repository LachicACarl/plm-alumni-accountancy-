import { afterEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
vi.mock("./supabase", () => ({ supabase: { rpc } }));

const { fetchAllPublicAlumni } = await import("./publicAlumni");

afterEach(() => rpc.mockReset());

describe("fetchAllPublicAlumni", () => {
  it("loads ordered pages until the final short page", async () => {
    const range = vi.fn()
      .mockResolvedValueOnce({ data: [{ id: "a" }, { id: "b" }], error: null })
      .mockResolvedValueOnce({ data: [{ id: "c" }], error: null });
    const order = vi.fn(() => ({ range }));
    rpc.mockReturnValue({ order });
    await expect(fetchAllPublicAlumni({ pageSize: 2 })).resolves.toEqual([{ id: "a" }, { id: "b" }, { id: "c" }]);
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(order).toHaveBeenCalledWith("id", { ascending: true });
    expect(range).toHaveBeenNthCalledWith(1, 0, 1);
    expect(range).toHaveBeenNthCalledWith(2, 2, 3);
  });

  it("throws rather than silently returning a truncated result at the page cap", async () => {
    const range = vi.fn().mockResolvedValue({ data: [{ id: "a" }], error: null });
    rpc.mockReturnValue({ order: vi.fn(() => ({ range })) });
    await expect(fetchAllPublicAlumni({ pageSize: 1, maxPages: 2 })).rejects.toThrow("exceeded the safety limit of 2 pages");
  });

  it("propagates RPC errors", async () => {
    const error = new Error("permission denied");
    const range = vi.fn().mockResolvedValue({ data: null, error });
    rpc.mockReturnValue({ order: vi.fn(() => ({ range })) });
    await expect(fetchAllPublicAlumni()).rejects.toBe(error);
  });

  it("rejects invalid pagination settings", async () => {
    await expect(fetchAllPublicAlumni({ pageSize: 0 })).rejects.toThrow(RangeError);
    await expect(fetchAllPublicAlumni({ pageSize: 1001 })).rejects.toThrow(RangeError);
  });
});
