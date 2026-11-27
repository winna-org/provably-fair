export type JsonPrimitive = string | boolean | number | null;
export type JsonArray = (JsonPrimitive | JsonObject | JsonArray)[];
export type JsonObject = {
  [key: string]: JsonPrimitive | JsonArray | JsonObject | object;
};

export type Json = JsonObject | JsonArray | JsonPrimitive;

