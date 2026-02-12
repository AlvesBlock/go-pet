import { http, HttpResponse } from "msw";
import type { CreateRidePayload, Incident } from "../types";
import { addChatMessage, addIncident, buildDashboardPayload, createRide } from "./dataStore";

const api = (path: string) => `/api${path}`;

export const handlers = [
  http.get(api("/dashboard"), () => {
    return HttpResponse.json(buildDashboardPayload());
  }),
  http.post(api("/rides"), async ({ request }) => {
    const body = (await request.json()) as CreateRidePayload;
    const ride = createRide({
      ...body,
      scheduledAt: new Date(body.scheduledAt),
    });
    return HttpResponse.json(ride, { status: 201 });
  }),
  http.post(api("/rides/:id/messages"), async ({ params, request }) => {
    const rideId = params.id as string;
    const body = (await request.json()) as { content: string; senderRole: "tutor" | "driver" | "support" };
    const record = addChatMessage({
      rideId,
      content: body.content,
      senderRole: body.senderRole,
    });
    return HttpResponse.json(record, { status: 201 });
  }),
  http.post(api("/incidents"), async ({ request }) => {
    const body = (await request.json()) as Omit<Incident, "id" | "createdAt">;
    const record = addIncident(body);
    return HttpResponse.json(record, { status: 201 });
  }),
  http.post(api("/uploads"), async ({ request }) => {
    const form = await request.formData();
    const file = form.get("file");
    const name = file && typeof file === "object" && "name" in file ? (file as File).name : "upload.bin";
    return HttpResponse.json({ url: `/uploads/${name}` }, { status: 201 });
  }),
];
