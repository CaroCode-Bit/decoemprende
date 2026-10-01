"use client";

import { Toast, useToast } from "./toast";

export function ProveedorToast() {
  const { mensaje, key } = useToast();

  return mensaje ? <Toast key={key} mensaje={mensaje} /> : null;
}
