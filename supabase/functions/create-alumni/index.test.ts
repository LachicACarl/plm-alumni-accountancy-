import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createAlumniHandler } from "./index.ts";

type MockOptions = {
  role?: string;
  inviteError?: string;
};

function makeHandler(options: MockOptions = {}) {
  let inviteCalls = 0;
  let invitePayload: Record<string, unknown> | null = null;
  const rpcCalls: Array<{ name: string; args: Record<string, unknown> }> = [];

  const fakeClient = {
    rpc: async (name: string, args: Record<string, unknown>) => {
      rpcCalls.push({ name, args });
      return { data: null, error: null };
    },
    auth: {
      getUser: async () => ({
        data: { user: { id: "admin-user" } },
        error: null,
      }),
      admin: {
        inviteUserByEmail: async (_email: string, payload: Record<string, unknown>) => {
          inviteCalls += 1;
          invitePayload = payload;
          if (options.inviteError) {
            return { data: { user: null }, error: { message: options.inviteError } };
          }
          return {
            data: { user: { id: "new-alumni", email: "alumni@example.test" } },
            error: null,
          };
        },
      },
    },
    from: (_table: string) => ({
      select: (_columns: string) => ({
        eq: (_column: string, _value: string) => ({
          single: async () => ({
            data: { role: options.role ?? "admin" },
            error: null,
          }),
        }),
      }),
    }),
  };

  const factory = (() => fakeClient) as unknown as typeof createClient;
  return {
    handler: createAlumniHandler(factory),
    getInviteCalls: () => inviteCalls,
    getInvitePayload: () => invitePayload,
    getRpcCalls: () => rpcCalls,
  };
}

function request(body: unknown, origin = "https://plm-alumni-accountancy.onrender.com") {
  return new Request("https://project.example.test/functions/v1/create-alumni", {
    method: "POST",
    headers: {
      Origin: origin,
      Authorization: "Bearer test-admin-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  email: " Alumni@Example.Test ",
  first_name: " Ada ",
  middle_name: " M ",
  last_name: " Lovelace ",
  student_number: " PLM-2024-001 ",
  graduation_year: 2024,
  profession: "Engineer",
  company: "Analytical Engines",
};

Deno.test("creates invitation with normalized email and profile metadata", async () => {
  const mock = makeHandler();
  const response = await mock.handler(request(validBody));
  const body = await response.json();

  if (response.status !== 201 || body.success !== true || body.invitationSent !== true) {
    throw new Error("Expected a successful invitation response.");
  }
  if (mock.getInviteCalls() !== 1) throw new Error("Expected exactly one invitation call.");

  const payload = mock.getInvitePayload() as { data?: Record<string, string>; redirectTo?: string };
  const queued = mock.getRpcCalls().find((call) => call.name === "queue_alumni_invite_profile");
  if (!queued) throw new Error("Expected profile data to be queued through the trusted RPC.");
  if (payload.data?.provisioning_token !== queued.args.p_token) {
    throw new Error("Invitation token does not match the trusted queue record.");
  }
  if (queued.args.p_first_name !== "Ada" || queued.args.p_student_number !== "PLM-2024-001") {
    throw new Error("Queued profile values were not normalized.");
  }
  if (payload.redirectTo !== "https://plm-alumni-accountancy.onrender.com/reset-password") {
    throw new Error("Unexpected invitation redirect URL.");
  }
});

Deno.test("returns 500 when Supabase rejects invitation/profile transaction", async () => {
  const mock = makeHandler({ inviteError: "duplicate key value violates unique constraint" });
  const response = await mock.handler(request(validBody));
  if (response.status !== 500) throw new Error("Expected a failed provisioning response.");
  if (mock.getInviteCalls() !== 1) throw new Error("Expected one invite attempt.");
  if (!mock.getRpcCalls().some((call) => call.name === "cancel_alumni_invite_profile")) {
    throw new Error("Failed invitations must clean up their trusted provisioning ticket.");
  }
});

Deno.test("rejects non-administrator callers", async () => {
  const mock = makeHandler({ role: "alumni" });
  const response = await mock.handler(request(validBody));
  if (response.status !== 403) throw new Error("Expected administrator authorization to be enforced.");
  if (mock.getInviteCalls() !== 0) throw new Error("Invitation must not be sent to non-admin callers.");
});

Deno.test("rejects invalid email before invitation", async () => {
  const mock = makeHandler();
  const response = await mock.handler(request({ ...validBody, email: "not-an-email" }));
  if (response.status !== 400) throw new Error("Expected invalid email to return 400.");
  if (mock.getInviteCalls() !== 0) throw new Error("Invalid email must not trigger an invitation.");
});

Deno.test("rejects a missing last name before invitation", async () => {
  const mock = makeHandler();
  const { last_name: _lastName, ...withoutLastName } = validBody;
  const response = await mock.handler(request(withoutLastName));
  if (response.status !== 400) throw new Error("Expected missing last name to return 400.");
  if (mock.getInviteCalls() !== 0) throw new Error("Missing last name must not trigger an invitation.");
});

Deno.test("returns 400 for malformed JSON", async () => {
  const mock = makeHandler();
  const malformed = new Request("https://project.example.test/functions/v1/create-alumni", {
    method: "POST",
    headers: {
      Origin: "https://plm-alumni-accountancy.onrender.com",
      Authorization: "Bearer test-admin-token",
      "Content-Type": "application/json",
    },
    body: "{ invalid json",
  });
  const response = await mock.handler(malformed);
  if (response.status !== 400) throw new Error("Expected malformed JSON to return 400.");
  if (mock.getInviteCalls() !== 0) throw new Error("Malformed JSON must not trigger an invitation.");
});

Deno.test("rejects a disallowed browser origin", async () => {
  const mock = makeHandler();
  const response = await mock.handler(request(validBody, "https://attacker.example"));
  if (response.status !== 403) throw new Error("Expected disallowed origin to return 403.");
  if (mock.getInviteCalls() !== 0) throw new Error("Disallowed origin must not trigger an invitation.");
});
