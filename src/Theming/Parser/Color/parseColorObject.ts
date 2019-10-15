import { Color } from "../../Color/Color";
import { Colors } from "./Colors";

export function parseColorObject(colors: Colors): Color[] {
  return Object.entries<string>(colors).map(([name, value]) => {
    return new Color().name(name).value(value);
  })
}
